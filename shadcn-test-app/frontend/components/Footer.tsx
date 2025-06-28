import Image from "next/image";
import Link from "next/link";

export default function Footer(){
  return(<footer className="w-full flex justify-center h-14 items-center">
    <Link href="https://github.com/sillybilly1542/">
      <Image 
        src="/github-mark.svg" 
        alt="github logo" 
        width={40} 
        height={40} 
      />
    </Link>
  </footer>);
}
