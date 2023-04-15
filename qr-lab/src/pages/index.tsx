import Image from 'next/image'
import { Inter } from 'next/font/google'
import { QR } from '@/components/qr'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [result, setResult] = useState("")

  function updateID(id :string) {
    setResult(id)
  }

  useEffect(()=>{
    console.log(result)
  }, [result])
  return (
    <main className="">
      <div className="">
        <div className='w-[100vw]'>
        <QR props={updateID} />
        <p>{result? result : "Scanning"}</p>
        </div>
      </div>
    </main>
  )
}
