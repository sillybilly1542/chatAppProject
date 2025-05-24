"use client"
import {useState, useEffect} from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import { checkLoginStatus } from '@/utils.js'

export default function Page(){
  const router = useRouter();

  const [info, setInfo] = useState({
    email: '',
    password: '' 
  })

  const [alert, setAlert] = useState<React.ReactNode | string>(null);

  const [passwordShown, setPasswordShown] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    axios.get('http://localhost:8000/api/check-auth').then(res => {
      if(res.data.authenticated){
        router.push('/app')
      }
    })
  }, [])

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', info, {withCredentials: true});

      if(response.data.success === true){
        router.push('/app') 
      } else {
        const msg = response.data.message
        if(msg === 'userNotFound'){
          setAlert(
            <>
              We couldn't find that username/email. Check your spelling, or try{' '} 
              <Link href='/register' className='text-blue-500 underline font-bold'>creating an account</Link>{'.'}
            </>
          );
        } else if(msg === 'incorrectPassword'){
          setAlert(
            <>
              Incorrect password, try again!
            </>
          );
       }
      }
      
    } catch (error: any) {
      console.error('Error: ', error)
      window.alert("error!")
    }
  } 

  useEffect(() => {
    const check = async () => {
      const res = await checkLoginStatus();
      if(res) router.push('/app')
    }
    check();
  }, [])

  return(
    <div className='flex flex-1 justify-center items-center flex-col'>
      <h1 className='text-3xl font-bold select-none'>Chat App</h1>
      <div className='shadow-lg rounded-xl p-4 border border-gray-200 mt-4 w-64'>
        <h1 className='mb-4 font-bold text-lg text-center select-none'>Login</h1> 
        <h2 className='select-none'>Email/Username</h2>
        <input 
          name="email"
          type="email" 
          className='border-gray-300 border-2 rounded-md p-0.5 w-full'
          value={info.email}
          onChange={handleInputChange}
        />

        <h2 className='select-none'>Password</h2>
        <div className="relative w-full">
          <input 
            type={passwordShown ? "text" : "password"} 
            name="password"
            className='border-gray-300 border-2 rounded-md p-0.5 pr-8 w-full'
            value={info.password}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={() => setPasswordShown(!passwordShown)}
            className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
          >
            {passwordShown ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {alert && (
          <div className='text-gray-600 p-2 rounded-md mt-2'>
            {alert}
          </div>
        )}
        <div className='flex justify-center'>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-lg mt-4 cursor-pointer transition-colors duration-300'
            onClick={handleSubmit}
          >Log In</button>
        </div>
        <h2 className='mt-2 text-center'>Don't have an account?</h2>
        <div className='flex justify-center'>
          <Link href="/register" className='underline text-blue-500 font-bold m-auto'>Sign Up!</Link>
        </div>
      </div>
    </div>
  )
}
