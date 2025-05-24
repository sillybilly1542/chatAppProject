"use client"
import {useState, useEffect} from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {checkLoginStatus} from '@/utils'

export default function Page(){
  const router = useRouter();

  const [info, setInfo] = useState({
    email: '',
    username: '',
    password: '',
    name: ''
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

  const handleSubmit = async () => {
    if(!isValidEmail(info.email)){
      setAlert('Invalid email! Try again.')
    } else if(info.username.length < 3 || info.username.length > 20){
      setAlert('Username must be between 3 and 20 characters long!')
    } else if(info.username.startsWith(' ') || info.username.endsWith(' ')){
      setAlert('Username cannot begin or end with a space!')
    } else if (!/^[A-Za-z0-9_]+$/.test(info.username)){
      setAlert('Username must only contain letters, numbers, and underscores!')
    } else if(info.password.length < 8){
      setAlert('Password must be at least 8 characters long!')
    } else try {
      const response = await axios.post('http://localhost:8000/api/register', info, {withCredentials: true});

      if(response.data.success === true){
        router.push('/app') 
      } else {
        const msg = response.data.message
        if(msg === 'usernameInUse'){
          setAlert(
            <>
              This username is already in use. If this is you,{' '}
              <Link href='/login' className='text-blue-500 underline font-bold'>log in</Link>{'.'}
            </>
          );
        } else if(msg === 'emailInUse'){
          setAlert(
            <>
              This email is already in use. If this is you,{' '}
              <Link href='/login' className='text-blue-500 underline font-bold'>log in</Link>{'.'}
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
        <h1 className='mb-4 font-bold text-lg text-center select-none'>Register</h1> 
        <h2 className='select-none'>Name</h2>
        <input 
          name="name"
          type="text" 
          className='border-gray-300 border-2 rounded-md p-0.5 w-full'
          value={info.name}
          onChange={handleInputChange}
        />

        <h2 className='select-none'>Email</h2>
        <input 
          name="email"
          type="email" 
          className='border-gray-300 border-2 rounded-md p-0.5 w-full'
          value={info.email}
          onChange={handleInputChange}
        />

        <h2 className='select-none'>Username</h2>
        <input
          type="text" 
          name="username"
          className='border-gray-300 border-2 rounded-md p-0.5 w-full'
          value={info.username}
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
          >Sign Up</button>
        </div>
        <h2 className='mt-2 text-center'>Already have an account?</h2>
        <div className='flex justify-center'>
          <Link href="/login" className='underline text-blue-500 font-bold m-auto'>Log In!</Link>
        </div>
      </div>
    </div>
  )
}

function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
