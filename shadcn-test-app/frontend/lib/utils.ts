import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchData(){
  const res = await axios.get('http://localhost:8000/api/fetch-data', {withCredentials: true})  

  return res.data.loggedIn ? res.data.data : false;
}

