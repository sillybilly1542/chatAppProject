import Image from 'next/image'


export default function Footer() {
  return (
    <div className='w-screen flex justify-center mb-5'>
      <a href='https://github.com/sillybilly1542' target='_blank'><Image width={30} height={30} src='/github-mark.svg' alt='GitHub logo with a link to my GitHub profile'/></a>
    </div>
  )
}
