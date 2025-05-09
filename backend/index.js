
import express from 'express'
import cors from 'cors'
import pg from 'pg'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

const app = express();

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  port: 5432,
  password: process.env.DB_PASSWORD,
  database: "chatAppProject"
});



dotenv.config()

app.use(cors());
app.use(express.json());

// if someone comes to this site, redirect them to frontend
app.get('/', (_, res) => {
  res.redirect('http://localhost:3000')
})

const port = 8000

app.listen(port, () => {
  console.log(`listening on 'http://localhost:${port}'`)
})
