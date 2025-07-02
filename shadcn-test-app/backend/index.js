import express from 'express'
import pg from 'pg'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'

const app = express();

app.use(cors({origin: "http://localhost:3000", credentials: true})) 
app.use(express.json())
app.use(cookieParser())

dotenv.config();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "chat_app",
  password: process.env.DB_PASSWORD
})

await db.connect();

app.post('/api/register', async (req, res) => {
  const {email, name, username, password} = req.body

  let result = await db.query("SELECT * FROM users WHERE email=$1", [email]);

  if(result.rows.length != 0){
    res.json({
      success: false,
      errorCode: 1 // 1: email in use
    })
  } else {
    result = await db.query("SELECT * FROM users WHERE username=$1", [username])
    if(result.rows.length != 0){
      res.json({
        success: false,
        errorCode: 2 // 2: username in use
      })
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      result = await db.query("INSERT INTO users (email, name, username, password) VALUES ($1, $2, $3, $4) RETURNING id", [email, name, username, hashedPassword]); 

      const userId = result.rows[0].id;
      
      res.cookie('loggedIn', userId, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 3600000,
        domain: 'localhost',
        path: '/'
      })

      res.json({ success: true })
    }
  }
})

app.post('/api/login', async (req, res) => {
  const {email, password} = req.body;
  
  let result = await db.query("SELECT * FROM users WHERE email=$1 OR username=$1", [email]);

  if(result.rows.length != 1){
    res.json({
      authenticated: false,
      errorCode: 1, // 1 -> email/username not found
    });
  } else if(!await bcrypt.compare(password, result.rows[0].password)) {
    res.json({
      authenticated: false,
      errorCode: 2 // 2 -> incorrect password
    })
  } else {
    const user = result.rows[0]

    res.cookie('loggedIn', user.id, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600000, // 7 days
    })

    res.json({ authenticated: true })
  }
})


app.get('/api/fetch-data', async (req, res) => {
  const c = req.cookies.loggedIn;

  if(!c){
    return res.json({loggedIn: false})
  } else {
    const res = await db.query("SELECT name, username, id FROM users WHERE id=$1", [c])

    return res.json({loggedIn: true, data: res.rows[0]})
  }
})

app.get('/api/search/:search', async (req, res) => {
  const search = req.params.search.trim();
  const loggedIn = req.cookies.loggedIn; 

  const result = await db.query(`
SELECT 
  u.id, 
  u.username,
  CASE 
    WHEN pr1.sender_id = $2 THEN 'sent'
    WHEN pr2.receiver_id = $2 THEN 'received'
    WHEN $2 = ANY(u.friends) THEN 'friends'
    ELSE 'none'
  END AS status
FROM users u
LEFT JOIN pending_requests pr1 ON pr1.receiver_id = u.id AND pr1.sender_id = $2
LEFT JOIN pending_requests pr2 ON pr2.sender_id = u.id AND pr2.receiver_id = $2
WHERE u.username ILIKE $1 AND u.id != $2 AND similarity(u.username, $1) > 0.3
ORDER BY similarity(u.username, $1) DESC
LIMIT 20
`, [`%${search}%`, loggedIn])

  return res.json({
    success: true,
    users: result.rows
  })
})

app.post('/api/create-request', async (req, res) => {
  const id1 = Number(req.cookies.loggedIn)
  const id2 = req.body.id;

  await db.query("INSERT INTO pending_requests VALUES ($1, $2)", [id1, id2])
  res.json({ success: true });
})


app.post('/api/create-friendship', async (req, res) => {
  const id1 = Number(req.cookies.loggedIn)
  const id2 = Number(req.body.id)

  await db.query(
    `UPDATE users SET friends = COALESCE(friends, '{}')::int[] || $1::int WHERE id = $2`,
    [id2, id1]
  )

  await db.query(
    `UPDATE users SET friends = COALESCE(friends, '{}')::int[] || $1::int WHERE id = $2`,
    [id1, id2]
  )

  await db.query(
    `DELETE FROM pending_requests WHERE sender_id = $1 AND receiver_id = $2`, [id2, id1]
  )
  res.json({ success: true });
})

app.get('/api/logout', (_, res) => {
  res.clearCookie('loggedIn', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 3600000, // 7 days
  })
  
  return res.json({success: true})
})

app.get('/api/fetch-outgoing', async (req, res) => {
  const id = Number(req.cookies.loggedIn);

  const result = await db.query(`
    SELECT users.id, users.username
    FROM pending_requests
    JOIN users ON pending_requests.receiver_id = users.id
    WHERE pending_requests.sender_id = $1
  `, [id])

  res.json({
    success: true,
    data: result.rows
  })
})

app.delete('/api/cancel-request/:id2', async (req, res) => {
  const sender = Number(req.cookies.loggedIn)
  const receiver = Number(req.params.id2)

  await db.query('DELETE FROM pending_requests WHERE sender_id = $1 AND receiver_id = $2', [sender, receiver])

  res.json({success: true})
})


app.listen(8000, () => {
  console.log('listening on http://localhost:8000')
})
