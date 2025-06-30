import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import NavbarRight from './NavbarRight'

export default async function Navbar(){
  const headersList = await headers();
  const pathname = headersList.get('x-next-url') || ('/')

  const authPages = ['/', '/register', '/login', '/404']

  const isAuthPage = authPages.includes(pathname);

  return(<nav className={`flex items-center h-14}`}>
    <Link href="/">
      <Image 
        src={"/messageIcon.png"} 
        alt="message icon" 
        width={50} 
        height={50}
        className='h-[50px] w-[50px] cursor-pointer select-none'
      />
    </Link>
    {/* part aligned to the right */}
    {isAuthPage ? <NavbarRight /> : <></>}


  </nav>)
}
