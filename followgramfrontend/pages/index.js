import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if(!localStorage.getItem('user')){
      router.push('/welcome');
    }
  },[]);
  return (
    <div className='h-full'>
      <Head>
        <title>Followgram</title>
        <meta name="description" content="Followgram share posts & text with your friend" />
      </Head>

      {/* load posts of user */}
      <div className='text-center text-2xl font-bold'>
        Home Page
      </div>
    </div>
  )
}
