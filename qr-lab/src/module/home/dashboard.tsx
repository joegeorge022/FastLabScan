import { QR } from '@/components/qr'
import { useEffect, useState } from 'react'

import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

import Header from '@/module/controller/header'
import TableData from '@/module/controller/tableData'
import { timeDifference } from '@/lib/time'
import { QRReturn, Students, Departments, Dash } from '@/lib/types'
import { useLocalStorage } from '@/lib/custom-hooks'
import { splitRegistration } from '@/lib/utils'



type Propper = {
  students:Students[],
  setStudents:(data:Students[])=>void,
  year: Dash['year'],
  dprt: Dash['dprt'],
}
function fetchStudentData(Propper:Propper){

  if (Propper.students === null){
    let data:Students[] = [
      {name: 'Pranav', roll: 49},
      {name: 'Prithvi', roll: 50},
      {name: 'Rajat', roll: 51},
      {name: 'Rohan', roll: 52},
    ]
    Propper.setStudents(data)
  }  
  // console.log(Propper.students)
}





type Props = { dash : Dash }
export default function Dashboard(Props:Props) {
  const {dprt, ends, starts, timer, id, year} = Props.dash
  const [students, setStudents] = useLocalStorage<Students[] | null>(dprt, null)
  const [list, setList] = useState([])
  const [eachStudent, setEachStudent] = useState<QRReturn | null>(null)

  const {toast} = useToast()

  useEffect(() => {
    fetchStudentData({students, setStudents, year, dprt})
  }, []);




  useEffect(() => {
    const x = eachStudent ? readAndCheck(eachStudent, year, dprt, students,toast ) : null
    console.log(x)
  }, [eachStudent]);
  
  return (
    <div className='p-5 h-dvh max-h-screen gap-5 grid grid-rows-6 md:grid-flow-col'>

      <Header />

      <Card className='p-0 overflow-hidden relative row-span-2 md:row-span-5 col-span-2'>
          {students !== null && <QR action={setEachStudent} />}
          <div className=' absolute border-black-500 border border-dashed rounded-sm left-3 right-3 top-3 bottom-3'></div>
      </Card>

      <TableData data={[]} />

    </div>
  )
}


function readAndCheck(eachStudent:QRReturn, year:number, dprt:Departments, localStorage:Students[], toast:(X:any)=>void){
  

  const regNo = splitRegistration(eachStudent.regNo)
  console.log(regNo,dprt,year)
  if (!regNo || regNo.dprt !== dprt ) return null
  

  const found = localStorage.find(student => student.roll === regNo.roll);
  if (found === undefined) return null
  

  toast({
    title: found.name,
    description: `${timeDifference(eachStudent.time)}`,
    variant: 'success',
    itemID: `${eachStudent.time}`
  })

  return {
    time: eachStudent.time,
    name: found.name,
    regNo: eachStudent.regNo
  }
}