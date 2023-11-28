'use client'

import { QR } from '@/components/qr'
import { useEffect, useState } from 'react'

import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

import Header from '@/module/controller/header'
import TableData from '@/module/controller/tableData'
import { timeDifference } from '@/lib/time'
import { QRReturn, Students, Departments, Dash, Year, RowData } from '@/lib/types'
import { useLocalStorage } from '@/lib/custom-hooks'
import { getYear, splitRegistration } from '@/lib/utils'

import Html5QrcodePlugin from '@/components/setQR'




type Propper = {
  students:Students[],
  setStudents:any
  year: Dash['year'],
  dprt: Dash['dprt'],
}
function fetchStudentData(Propper:Propper){
  // fetch the data
  if (Propper.students.length === 0){
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


const removeSpace = (x : string)=> {

  let y = x.split(' ')
  return y.join('-')

}


type Props = { dash : Dash }
export default function Dashboard(Props:Props) {
  const {dprt, ends, starts, timer, id, year} = Props.dash
  const [students, setStudents] = useLocalStorage<Students[]>(`${year}/${dprt}`, [])

  const [list, setList] = useLocalStorage<RowData[]>(`${year}/${dprt}/${removeSpace(new Date().toDateString())}/`,[])
  const [eachStudent, setEachStudent] = useState<QRReturn | null>(null)

  const onScanSuccess = (decodedText:string,decodedResult:any)=> setEachStudent({regNo:decodedText, time: new Date().getTime() })
  const {toast} = useToast()
  

  useEffect(() => {
    fetchStudentData({students, setStudents, year, dprt})
  }, []);


  useEffect(() => {
    const x = eachStudent ? readAndCheck(eachStudent, year, dprt, students,toast ) : null
    if (x) setList(e => [x,...e])
    else toast({
      title: 'Wrong QR',
      description: 'Please scan the correct QR',
      variant: 'destructive',
      // itemID: `${eachStudent.time}`
    })

  }, [eachStudent]);

  
  return (
    <div className='p-5 h-dvh max-h-screen gap-5 grid grid-rows-6 md:grid-flow-col'>
      <Header />

      <Card className='p-0 overflow-hidden relative row-span-2 md:row-span-5 col-span-2'>
          
          {students !== null && <Html5QrcodePlugin onScanSuccess={onScanSuccess}/>}
          <div className=' -z-10 absolute border-black-500 border border-dashed rounded-sm left-3 right-3 top-3 bottom-3'></div>
      </Card>

      <TableData data={list} />
    </div>
  )
}


// function upload(){}

function readAndCheck(eachStudent:QRReturn, year:Year, dprt:Departments, localStorage:Students[], toast:(X:any)=>void){

  const regNo = splitRegistration(eachStudent.regNo)
  if (!regNo || regNo.dprt !== dprt || getYear(regNo.year) !== year) return null
  

  const found = localStorage.find(student => student.roll === regNo.roll);
  if (found === undefined) return null
  

  toast({
    title: found.name,
    description: eachStudent.regNo,
    variant: 'success',
    itemID: `${eachStudent.time}`
  })

  return {
    time: eachStudent.time,
    name: found.name,
    regNo: eachStudent.regNo
  } as RowData
}