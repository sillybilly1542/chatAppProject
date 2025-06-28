'use client'

import React, {useState} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { SmartFormField } from '@/components/SmartFormField'
import { useRouter } from 'next/navigation'

const registerFormSchema = z.object({
  email: z.string(),

  password: z.string()
  .min(8, {message: "Password must be at least 8 characters long!"})
  .max(50, { message: "Password must be at most 50 characters long!" })
  .regex(/^[^\p{Extended_Pictographic}]*$/u, {message: "Password cannot contain emojis!"}),
})

export default function RegisterForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    const result = await axios.post('http://localhost:8000/api/login', values, {withCredentials: true});

    if(result.data.authenticated){
      router.push('/app')
    } else {
      if(result.data.errorCode == 1){
        setFormAlert("User not found!") 
      } else if(result.data.errorCode == 2){
        setFormAlert("Incorrect password!");
      }
    }
  }

  const [formAlert, setFormAlert] = useState<string | null>(null)


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 border border-gray-300 p-4 rounded-lg shadow-[2px_2px_4px_0px_rgba(0,0,0,0.2)] w-80 h-fit"
      >
        <h2 className='text-center font-bold'>Welcome Back</h2>
        <SmartFormField
          form={form}
          name="email"
          label="Email/Username"
        />
        <SmartFormField
          form={form}
          name="password"
          label="Password"
          type="password"
        />

        <AnimatePresence mode="wait" initial={false}>
          {formAlert != null && (
            <motion.div 
              key={`${name}-description`}
              initial={{height: 0, opacity: 0}}
              animate={{height: "auto", opacity: 1}}
              exit={{height: 0, opacity: 0}}
              transition={{duration: 0.2, ease: 'easeInOut'}}
            >
              <h1 className='text-center text-red-500 font-semibold'>{formAlert}</h1>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" className="w-full cursor-pointer">
          Log In 
        </Button>
      </form>
    </Form>
  )
}

