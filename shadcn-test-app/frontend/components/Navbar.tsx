import Image from 'next/image'
import Link from 'next/link'
import NavbarRight from './NavbarRight'

export default async function Navbar(){
  return(<nav className={`flex items-center h-14}`}>
    <Link href="/"> 
      <Image 
        src={"/messageIcon.png"} 
        alt="message icon" 
        width={50} 
        height={50}
        className='h-[50px] w-[50px] select-none'
      />
    </Link>
    {/* part aligned to the right */}
    <NavbarRight />

  </nav>)
}
