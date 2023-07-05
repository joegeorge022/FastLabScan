import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { timeDifference } from "@/lib/time"
import { ChevronRight, X } from "lucide-react"


const Row = (Props:any)=> {
  const { dprt, total, present, time, date } = Props.data

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

const data = [
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
  {id: '1233',dprt: 'AD', total: 61, present: 51, time: '15:00', date:'15-06-23'},
]

export default function HomeTable() {


  return (
    <section className="w-full h-screen flex flex-col justify-center items-center py-5 gap-5">
      
      <Card>
        <CardContent className="p-2 flex justify-between gap-2">
        <Button variant={'destructive'}>
            Logout <X/>
          </Button>
          <Button className=" flex-grow">
            Create new Attendence<ChevronRight/>
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
