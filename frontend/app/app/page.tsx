'use client'
import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { checkLoginStatus } from '@/utils.js';
import axios from 'axios'
import FriendsList from '@/components/friendsList'


export default function App(){
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<null | Boolean>(null)
  const [data, setData] = useState<{id: number, username: string, name: string, friends: number[]} | null>(null)

  useEffect(() => {
    const func = async () => {
      const res = await checkLoginStatus();
      if (!res) {
        router.push('/login')
        return;
      }
      const result = await axios.get('http://localhost:8000/api/fetch-data', {withCredentials: true});
      setData(result.data.data)
      setAuthenticated(true)
    }
    func()
  }, [])

  useEffect(() => { 
  }, [])

  return (
    <div>
      {authenticated && data && <div className='m-2'>
        <h1 className='text-2xl font-semibold'>
          Hello, {data.name}
        </h1>
        <h2 className='text-lg mt-4'>
          Your Conversations
        </h2>
        <FriendsList data={{ friends: data.friends }}/>
      </div>}
      {authenticated === false && <div className='m-2'>hi</div>}
    </div>
  )
}
