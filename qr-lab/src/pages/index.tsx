import { QR } from '@/components/qr'
import { useEffect, useState } from 'react'
import Profile from '@/components/students'
import notificate from '@/components/notify'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table" 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

import { timeDifference } from '@/lib/time'

type QRReturn = {
  regNo: string,
  time: number
}

interface RowData extends QRReturn {
  name: string,
  dept: string,
}

const Row = (Props:QRReturn)=> {
  const {regNo, time} = Props
  console.log(Props)
  return (
    <TableRow className=''>
      <TableCell className="font-medium">{regNo}</TableCell>
      <TableCell>{''}</TableCell>
      <TableCell>{''}</TableCell>
      <TableCell className="text-right">{timeDifference(time) || ''}</TableCell>
    </TableRow>
  )
}

const Dialoger = ()=> {
  const { toast } = useToast()
  return (
    <DialogContent>
      
      <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3">
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
            <Button type="submit" variant={'destructive'}>Close</Button>
        </div>

        <DialogFooter>
        </DialogFooter>
      
    </DialogContent>
  )
}



export default function Home() {
  const {toast} = useToast()
  const [result, setResult] = useState<QRReturn[]>([])

  useEffect(()=>{
    toast({
      title: `${result[0]?.regNo ||'' } as joined the class`,
      description: `${timeDifference(result[0]?.time ||0 )}`,
      variant: 'success',
      itemID: `${result[0]?.time}`
    })
  },[result])
  return (
    <div className='p-5 h-dvh max-h-screen gap-5 grid grid-rows-6 md:grid-flow-col'>

      <Card className='col-span-2 row-span-1'>
        <CardHeader className='flex-row justify-between items-center p-4'>
          AD Lab closing time 12:00

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Close now</Button>
            </DialogTrigger>

            <Dialoger />
          </Dialog>
        </CardHeader>
      </Card>

      <Card className='p-0 overflow-hidden relative row-span-2 md:row-span-5 col-span-2'>
          <QR updateID={setResult} />
          <div className=' absolute border-black-500 border border-dashed rounded-sm left-3 right-3 top-3 bottom-3'></div>
      </Card>

      <Card className='px-3 overflow-y-scroll h-full row-span-3 md:row-span-full col-span-2'>
        <Table>
          {/* <TableCaption>Total {10}</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Reg no</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Dept</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            { result.map(row => <Row regNo={row.regNo} time={row.time} />) }
          </TableBody>
        </Table>

      </Card>
    </div>
  )
}
