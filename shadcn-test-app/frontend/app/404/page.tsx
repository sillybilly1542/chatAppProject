import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Gabarito } from 'next/font/google'

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ['500', '700']
});

export default function NotFound() {
  return (
    <div className={`${gabarito.className} flex flex-col items-center h-[calc(100vh-3.5rem)]`}>
      <h1 className="text-4xl font-bold mb-4 mt-20">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
} 
