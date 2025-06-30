import { z } from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import axios from "axios"
import {useState} from 'react'
import { Gabarito } from "next/font/google"

const gabarito = Gabarito({
  subsets: ['latin'],
  weight: ['500', '700']
})


const formSchema = z.object({
  username: z.string()
  .max(100, {message: "Please enter less than 100 characters!"})
  .regex(/^[^\p{Extended_Pictographic}]*$/u, {message: "Please don't enter emojis!"}),
})

type user = {
  username: string;
  id: number;
}


export default function AddFriendsPage(){
  const [users, setUsers] = useState<user[] | null | 0>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>){
    const result = await axios.get(`http://localhost:8000/api/search/${values.username}`, {withCredentials: true})
    
    if(result.data.users.length == 0){
      setUsers(0)
      console.log(result.data.users)
    } else {
      setUsers(result.data.users)
      console.log(result.data.users)
    }
  }

  return(
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-2 flex">
          <FormField 
            control={form.control}
            name='username'
            render={({field}) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input placeholder="Search by username" autoComplete='off' {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="cursor-pointer">Search</Button>
        </form>
      </Form>
      {users != null && <div>
        {users == 0 ? 
          <h1 className={`${gabarito.className} text-center mt-2 text-gray-500`}>We couldn't find any users that matched your search.</h1> 

          : <>

        </>}
      </div>} 
    </div>
  )
}

