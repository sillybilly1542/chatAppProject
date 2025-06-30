import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import db from '@/lib/db'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FriendsDialog from "@/components/AddFriends/FriendsDialog";


export default async function Page() { 
  const c = await cookies(); 
  const loggedIn = c.get('loggedIn')

  if(!loggedIn){
    redirect('/login')
  }

  let res = await db.query('SELECT name, username FROM users WHERE id=$1', [loggedIn.value])
  const data = res.rows.length == 1 ? res.rows[0] : null
     
  return(
    <>
      {data && <div>
        <div className="flex items-center">
          <h1 className="ml-2 font-bold text-xl mt-2">
            Hello, {data.name}
          </h1>
          <FriendsDialog /> 
        </div>
        <h2 className="ml-2 mt-8">Your Conversations</h2>
      </div>}
    </>
  )
}
