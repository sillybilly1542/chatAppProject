
import express from 'express'
import cors from 'cors'
import pg from 'pg'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser())

dotenv.config()

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  port: 5432,
  password: process.env.DB_PASSWORD,
  database: 'chatAppProject'
});

await db.connect();

// if someone comes to this site, redirect them to frontend
app.get('/', (_, res) => {
  res.redirect('http://localhost:3000')
})

app.post('/api/register', async (req, res) => {
  const {email, password, username, name} = req.body;

  let result = await db.query('SELECT * FROM users WHERE email=$1', [email]);

  if(result.rows.length != 0){
    return res.status(200).json({
      success: false,
      message: 'emailInUse',
    })
  }

  result = await db.query('SELECT * FROM users WHERE username=$1', [username]);

  if(result.rows.length != 0){
    return res.status(200).json({
      success: false,
      message: 'usernameInUse',
    })
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  result = await db.query(
    "INSERT INTO users (email, password, username, name) VALUES ($1, $2, $3, $4) RETURNING id, username",
    [email, hashedPassword, username, name]
  );

  if(result.rowCount === 1){
    const user = result.rows[0];
    res.cookie('loggedIn', user.id, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: false,
      path: '/'
    });

    return res.status(201).json({
      success: true,
      message: 'userCreated',
    })
  }
});
app.post('/api/login', async (req, res) => {
  const {email, password} = req.body;

  let result = await db.query('SELECT * FROM users WHERE email=$1 OR username=$1', [email]);
  const user = result.rows[0];

  if(result.rows.length != 1){
    return res.status(200).json({
      success: false,
      message: 'userNotFound',
    })
  }

  if(!await bcrypt.compare(password, result.rows[0].password)){
    return res.status(200).json({
      success: false,
      message: 'incorrectPassword',
    })
  }

  res.cookie('loggedIn', user.id, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: false,
    path: '/',
  })

  return res.status(200).json({
    success: true,
  })


});

app.post('/api/logout', (req, res) => {
  res.clearCookie('loggedIn', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  });


  res.status(200).json({success: true});
})

app.get('/api/check-auth', (req, res) => {
  const userId = req.cookies.loggedIn;
  
  if (!userId) {
    return res.status(200).json({loggedIn: false})
  }

  res.json({loggedIn: true, userId})
})

app.get('/api/fetch-data', (req, res) => {
  try {
    const cookies = req.cookies;
    const userId = cookies.loggedIn;


    if (!userId) {
      return res.status(200).json({loggedIn: false})
    } else {
      const fetch = async () => {
        const result = await db.query("SELECT id, username, name, friends FROM users WHERE id=$1", [userId])
        res.json({data: result.rows[0]})
      }
      fetch();
    }
  } catch(err){
    console.log(err)
  }
})

app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await db.query("SELECT username FROM users WHERE id=$1", [userId]);

    if(result.rows.length === 0){
      res.json({
        success: false,
        message: 'user not found',
      })
    } else {
      res.json({
        success: true,
        username: result.rows[0].username
      })
    }
  } catch (error) {
    console.error(error);
  }
})

app.get('/api/colors/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await db.query("SELECT color FROM users WHERE id=$1", [userId]);

    if(result.rows.length === 0){
      res.json({
        success: false,
        message: 'user not found',
      })
    } else {
      res.json({
        success: true,
        color: result.rows[0].color
      })
    }
  } catch (error) {
    console.error(error);
  }
})

const port = 8000;

app.listen(port, () => {
  console.log(`listening on 'http://localhost:${port}'`)
})

