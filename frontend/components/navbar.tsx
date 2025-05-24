'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import axios from 'axios'

export default function Navbar(){
  const pathname = usePathname();
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  const handleLogout = async () => {
    const res = await axios.post('http://localhost:8000/api/logout', {}, {
      withCredentials: true,
    }) 

    if(res.data.success){
      router.push('/')
    }

    
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      setScrolled(scrollY !== 0)
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // cleanup
    };
  }, []);  

  return (
    <div className={`${scrolled ? 'shadow-md' : ''} flex sticky top-0 z-50 items-center transition-all duration-300`}>
      <Link href="/"><Image src="/messageIcon.png" alt="Message Icon" width={60} height={60}/></Link>
      {pathname === '/' && <div className='ml-auto'>
        <button onClick={() => router.push('/login')} className='transition-colors duration-300 ease-in-out bg-gray-100 hover:bg-gray-300 text-black p-1 rounded-md cursor-pointer select-none'>Log In</button>
        <button onClick={() => router.push('/register')} className='transition-colors duration-300 ease-in-out bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-md cursor-pointer mx-2 select-none'>Get Started</button>
      </div>}
      {pathname === '/app' && <button className='ml-auto bg-gradient-to-b from-gray-800 to-black rounded-md cursor-pointer mr-2 select-none text-white p-1' onClick={handleLogout}>Log Out</button>}
    </div>

  )
}
