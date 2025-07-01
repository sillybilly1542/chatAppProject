import Footer from "@/components/Footer";
import {Button} from '@/components/ui/button'
import Link from "next/link";
export default function Page(){
  


  return(<div className="h-[calc(100vh-3.5rem)] flex justify-center flex-col">
    <div className="h-[calc(100vh-6rem)] w-full">
      <h1 className="text-5xl mt-20 text-center">
        Chat App
      </h1> 
      <h2 className="text-xl text-center">
        Made By Michael
      </h2>
      <Link href='/register'>
        <Button className="h-10 w-32 block mt-4 mx-auto">Get Started</Button>
      </Link>
    </div>
    <Footer /> 
  </div>);
}
