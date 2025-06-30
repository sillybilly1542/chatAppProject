
'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import {FiEye, FiEyeOff} from 'react-icons/fi'
import { Button } from '@/components/ui/button'

interface SmartFormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: FieldPath<T>
  label: string
  type?: string
  description?: string
}

export function SmartFormField<T extends FieldValues>({
  form,
  name,
  label,
  type = 'text',
  description,
}: SmartFormFieldProps<T>) {
  const [focused, setFocused] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password';

  useEffect(() => {
    return () => setFocused(null)
  }, [])

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='relative'>
              <Input
                {...field}
                type={isPassword && showPassword ? 'text' : type}
                onFocus={() => setFocused(name)}
                onBlur={() =>
                  setTimeout(() => {
                    setFocused((prev) => (prev === name ? null : prev))
                  }, 50)
                }
              />
              {isPassword && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowPassword(prev => !prev)}
                  className='absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent shadow-none'
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className='w-4 h-4 ' />}
                </Button>
              )} 
            </div>
          </FormControl>
          <AnimatePresence mode="wait" initial={false}>
            {focused === name && description && (
              <motion.div 
                key={`${name}-description`}
                initial={{height: 0, opacity: 0}}
                animate={{height: "auto", opacity: 1}}
                exit={{height: 0, opacity: 0}}
                transition={{duration: 0.3, ease: 'easeInOut'}}
              >
                <FormDescription>{description}</FormDescription>
              </motion.div>
            )}
          </AnimatePresence>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
