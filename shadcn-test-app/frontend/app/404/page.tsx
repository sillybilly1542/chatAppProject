import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center h-[calc(100vh-3.5rem)]">
      <h1 className="text-4xl font-bold mb-4 mt-20">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <Link href="/">
        <Button className="cursor-pointer">Return Home</Button>
      </Link>
    </div>
  )
} 
