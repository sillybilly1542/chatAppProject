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

  const result = await db.query("SELECT id, username FROM users WHERE username ILIKE $1 AND id!=$2", [`%${search}%`, loggedIn])     

  return res.json({
    success: true,
    users: result.rows
  })
})

app.listen(8000, () => {
  console.log('listening on http://localhost:8000')
})
