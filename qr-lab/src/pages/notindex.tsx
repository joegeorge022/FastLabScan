import Image from 'next/image'
import { Inter } from 'next/font/google'
import { QR } from '@/components/qr'
import { useEffect, useState } from 'react'
import Profile from '@/components/students'
import notificate from '@/components/notify'

const inter = Inter({ subsets: ['latin'] })
type Data = { name: string, reg: string } | void
//    ^?

export default function Home() {
  const [result, setResult] = useState<Data | null>(null)

  function updateID(id :string, time: number) {

    fetch(`/api/students/${id}`)
    .then(res => {

          res.json()
             .then((data) => setResult(data)) 

    })
    .catch(err => {
          console.log(err)
          setResult(null)
    })

  }

  useEffect(()=>{
    result ? notificate(result) : null
    result ? console.log(result) : null
  }, [result])

  return (
    <main className="">
      <div className="">
        <div className='w-[100vw]'>
          
        <QR updateID={updateID} />
          {result? <Profile data={result} /> : <p>Scanning</p>}
        </div>
      </div>
    </main>
  )
}
