'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { SmartFormField } from '@/components/SmartFormField'
import axios from 'axios'
import React, {useState} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const registerFormSchema = z.object({
  username: z.string()
  .min(3, {message: "Username must be between 3 and 20 characters!"})
  .max(20, { message: "Username must be between 3 and 20 characters!" })
  .regex(/^[a-zA-Z0-9]+$/, {message: "Username must only contain letters and numbers!"}),


  password: z.string()
  .min(8, {message: "Password must be at least 8 characters long!"})
  .max(50, { message: "Password must be at most 50 characters long!" })
  .regex(/^[^\p{Extended_Pictographic}]*$/u, {message: "Password cannot contain emojis!"}),

  email: z.string()
  .email({ message: "Please enter a valid email!" }),

  name: z.string()
  .max(50, { message: "Name must be at most 50 characters long!" }),
})

export default function RegisterForm() {
  const router = useRouter();
  
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      name: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    const result = await axios.post("http://localhost:8000/api/register", values, {withCredentials: true})

    if(result.data.success){
      router.push('/app')
      setFormAlert(null)
    } else {
      const errorCode = result.data.errorCode;
      if(errorCode == 1){
        setFormAlert("Email already in use!")
      } else if(errorCode == 2){
        setFormAlert("Username already in use!")
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
        <h2 className='text-center font-bold'>Register</h2>
        <SmartFormField
          form={form}
          name="email"
          label="Email"
          description="Please enter your primary social email. It won't be shared with anyone else."
        />
        <SmartFormField
          form={form}
          name="name"
          label="Name"
          description="This is your private name. It won't be shown to anyone else."
        />
        <SmartFormField
          form={form}
          name="username"
          label="Username"
          description="This is your public username. It's what you'll show up as to others."
        />
        <SmartFormField
          form={form}
          name="password"
          label="Password"
          type="password"
          description="Choose a strong password, and don't share it with anyone else."
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

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </Form>
  )
}
