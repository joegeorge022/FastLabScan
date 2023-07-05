import { QR } from '@/components/qr'
import { useEffect, useState } from 'react'

import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

import Header from '@/module/controller/header'
import TableData from '@/module/controller/tableData'
import { timeDifference } from '@/lib/time'
import { QRReturn, Students, Deprtments } from '@/lib/types'
import { dash } from '@/pages/attendence'
import { useLocalStorage } from '@/lib/custom-hooks'


function fetchStudentData(students:Students[], setStudents:(data:Students[])=>void){

  if (students === null){
    let data:Students[] = [
      {name: 'Pranav', regNo: '21/ad/049'},
      {name: 'Prithvi', regNo: '21/ad/050'},
      {name: 'Rajat', regNo: '21/ad/051'},
      {name: 'Rohan', regNo: '21/ad/052'},
    ]

    setStudents(data)
  }
  
  console.log(students)
}

type Props = { dash : dash }
export default function Dashboard(Props:Props) {
  const {dprt, ends, starts, timer} = Props.dash
  const [students, setStudents] = useLocalStorage<Students[] | null>(dprt, null)


  fetchStudentData(students, setStudents)



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
          {students !== null && <QR action={setStudentData} />}
          <div className=' absolute border-black-500 border border-dashed rounded-sm left-3 right-3 top-3 bottom-3'></div>
      </Card>

      <TableData data={StudentData} />

    </div>
  )
}
