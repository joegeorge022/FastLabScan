import Image from 'next/image'
import { Inter } from 'next/font/google'
import { QR } from '@/components/qr'
import { useEffect, useState } from 'react'
import Profile from '@/components/students'

const inter = Inter({ subsets: ['latin'] })
type Data = { name: string, reg: string } | void

export default function Home() {
  const [result, setResult] = useState<Data | null>(null)

  function updateID(id :string) {

    fetch(`/api/students/${id}`)
    .then(res => {

          res.status === 200 ? res.json()
                                  .then((data) => setResult(data)) 
                             : new Error("User not found") && setResult(null)

    })
    .catch(err => {
          console.log(err)
          setResult(null)
    })

  }

  useEffect(()=>{
    console.log(result)
  }, [result])

  return (
    <main className="">
      <div className="">
        <div className='w-[100vw]'>
          
        <QR updateID={updateID} />
          {result? result.name : <p>Scanning</p>}
        </div>
      </div>
    </main>
  )
}
