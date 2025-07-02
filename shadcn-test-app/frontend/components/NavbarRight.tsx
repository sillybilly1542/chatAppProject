'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import { redirect } from 'next/navigation'

export default function NavbarRight(){
  const pathname = usePathname();

  const authPages = ['/', '/login', '/register', '/404']

  const isAuthPage = authPages.includes(pathname)

  const logout = async () => {
    const result = await axios.get('http://localhost:8000/api/logout', {withCredentials: true})

    if(result.data.success){
      redirect('/')
    }
  }

  return(
    <>
      {isAuthPage ? <div className="ml-auto">
        <Link href="/login">
          <Button
            variant="ghost"
            className='mr-2'
          >
            Log In
          </Button>
        </Link>
        <Link href="/register">
          <Button
            variant='default'
            className='mr-2'
          >
            Get Started        
          </Button>
        </Link>
      </div> : 
      <>
        <Button className='ml-auto mr-2' onClick={logout}>Log Out</Button>      
      </>}
    </> 
  )
}
