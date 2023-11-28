'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { Attendence, User } from "@/lib/types"
import { ChevronRight, X } from "lucide-react"
import Link from "next/link"
import { v4 as uuid } from "uuid"
 
const ConfirmAction = ({action}: {action: ()=> void} ) => {
  return ( 
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm your action?</DialogTitle>
          <DialogDescription> please provide your password to continue with action </DialogDescription>
        </DialogHeader>

          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input type="password" name="password" placeholder="**** ****" className="valid:bg-green-500" required />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={action}>
                Continue<ChevronRight />
            </Button>
          </DialogFooter>
      </DialogContent>
   );
}


const Row = (Props:{data:Attendence})=> {
  const { dprt, total, present, time, date }= Props.data

  return (
    <TableRow className=''>
      <TableCell className="font-medium">{dprt}</TableCell>
      <TableCell>{`${present}/${total}`}</TableCell>
      <TableCell>{time}</TableCell>
      <TableCell>{date}</TableCell>
      
      <TableCell className="p-0">
        <Button variant={'ghost'} className="">
          <ChevronRight/>
        </Button>
      </TableCell>
    </TableRow>
  )
}

const data:Attendence[] = [
  {id: uuid(),dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: uuid(),dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
]

type Props = {
}
export default function HomeTable(Props:Props) {
  const setUser = (...a:any[]) => {}

  async function signOut() {
    const { error } = await supabase.auth.signOut()
  }


  return (
    <section className="w-full h-screen flex flex-col justify-center items-center py-5 gap-5">
      
      <Card>
        <CardContent className="p-2 flex justify-between gap-2">
            <Dialog>
                <DialogTrigger asChild>
                  <Button variant='destructive' onClick={() => signOut()}>
                    Logout <X/>
                  </Button>
                </DialogTrigger>

                <ConfirmAction action={()=>setUser(null)} />
            </Dialog>

          <Button className=" flex-grow" asChild>
            <Link href={'/attendence'}>Create new Attendence<ChevronRight/></Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-y-scroll md:overflow-x-visible h-full scrollbar">
        <Table>
          {/* <TableCaption>Total {10}</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="">Department</TableHead>
              <TableHead>Count</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            { data.map((row) => <Row key={row.id} data={row} />) }
          </TableBody>
        </Table>
      </Card>

    </section>
  )
}
