import { QR } from '@/components/qr'
import { useEffect, useState } from 'react'

import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

import Header from '@/module/controller/header'
import TableData from '@/module/controller/tableData'
import { timeDifference } from '@/lib/time'
import { QRReturn } from '@/lib/types'


export default function Home2() {
  const {toast} = useToast()
  const [StudentData, setStudentData] = useState<QRReturn[]>([])

  useEffect(()=>{
    toast({
      title: `${StudentData[0]?.regNo ||'' } as joined the class`,
      description: `${timeDifference(StudentData[0]?.time ||0 )}`,
      variant: 'success',
      itemID: `${StudentData[0]?.time}`
    })
  },[StudentData])

  
  return (
    <div className='p-5 h-dvh max-h-screen gap-5 grid grid-rows-6 md:grid-flow-col'>

      <Header />

      <Card className='p-0 overflow-hidden relative row-span-2 md:row-span-5 col-span-2'>
          <QR action={setStudentData} />
          <div className=' absolute border-black-500 border border-dashed rounded-sm left-3 right-3 top-3 bottom-3'></div>
      </Card>

      <TableData data={StudentData} />

    </div>
  )
}
