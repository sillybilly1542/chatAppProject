'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'


export default function NavbarRight(){
  const pathname = usePathname();

  const authPages = ['/', '/login', '/register', '/404']

  const isAuthPage = authPages.includes(pathname)
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
      
      </>}
    </> 
  )
}
