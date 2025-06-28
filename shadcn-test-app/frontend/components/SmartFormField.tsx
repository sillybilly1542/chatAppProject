
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
            <Input
              {...field}
              type={type}
              onFocus={() => setFocused(name)}
              onBlur={() =>
                setTimeout(() => {
                  setFocused((prev) => (prev === name ? null : prev))
                }, 50)
              }
            />
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
