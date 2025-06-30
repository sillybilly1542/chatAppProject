import { cookies } from "next/headers";
import db from '@/lib/db'

export default async function FriendsList(){
  const c = await cookies();
  const loggedIn = c.get('loggedIn')

  if(loggedIn){

  }
  

  return(<></>);
}
