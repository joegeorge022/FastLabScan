import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { timeDifference } from "@/lib/time";
import { QRReturn, RowData } from "@/lib/types";


const Row = (Props:{data:RowData})=> {
    const {regNo, time, name} = Props.data
    return (
      <TableRow className=''>
        <TableCell className="font-medium">{regNo}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell className="text-right">{timeDifference(time) || ''}</TableCell>
      </TableRow>
    )
  }


// interface TableDataProps extends QRReturn {}
 
const TableData = ({data}:{data:RowData[]}) => {
    console.log(data)
    return ( 
        <Card className='px-3 overflow-y-scroll h-full row-span-3 md:row-span-full col-span-2'>
        <Table>
          {/* <TableCaption>Total {10}</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Reg no</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            { data.map(row => <Row key={row.time} data={row} />) }
          </TableBody>
        </Table>
      </Card>
     );
}
 
export default TableData;


