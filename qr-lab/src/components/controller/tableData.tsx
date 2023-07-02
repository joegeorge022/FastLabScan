import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { timeDifference } from "@/lib/time";
import { QRReturn } from "@/lib/types";
import { FunctionComponent } from "react";


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


// interface TableDataProps extends QRReturn {}
 
const TableData = ({data}:{data:QRReturn[]}) => {
    console.log(data)
    return ( 
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
            { data.map(row => <Row regNo={row.regNo} time={row.time} />) }
          </TableBody>
        </Table>
      </Card>
     );
}
 
export default TableData;


