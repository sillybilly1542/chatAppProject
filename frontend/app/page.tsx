'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation';

import Footer from '@/components/footer'


export default function Page(){
  const router = useRouter();

  return(
    <div className="duration-300 transition-all flex flex-col flex-1">
      {/* main part */}
      <div className='flex-1 flex justify-center'>
        <div className='text-center mt-20'>
          <h1 className='text-5xl'>Chat App</h1>
          <h2 className='text-xl'>Made by Michael</h2>
          <div>
            <button onClick={() => router.push('/register')} className='w-30 bg-gradient-to-b from-gray-800 to-black text-white h-10 rounded-lg mt-5 cursor-pointer'>
              Get Started   
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
