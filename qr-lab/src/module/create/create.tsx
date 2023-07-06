import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { hourUp } from "@/lib/time"
import { Departments, Dash, deprtments } from "@/lib/types"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { SyntheticEvent, useEffect, useState } from "react"
import { v4 as uuid } from 'uuid';


const timer = [ 5,10,15,20,25, 'Manual' ]

type Props = { setDash: (dash:Dash)=>void }
export default function Create(Props:Props) {

    const [selectTimeEnd, setTimeEnd] = useState(false)
    const [endTime, setEndTime] = useState('')
    const [startTime, setStartTime] = useState('')

    useEffect(() => {
        if (!selectTimeEnd && startTime !== '')
            setEndTime(hourUp(startTime))
            
    }, [startTime, selectTimeEnd]);

    function onSubmit(e:SyntheticEvent){
        type input = { value : string }
        type target = SyntheticEvent['target'] & {departments: input, timer :input, year :input }
    
        e.preventDefault()
        const target = e.target as target

        let data = {
          dprt: target.departments.value,
          year: parseInt(target.year.value),
          timer: target.timer.value,

          starts:startTime,
          ends:endTime,
          id: uuid()
        } as Dash

        Props.setDash(data)
    }

  return (
    <section className="w-full h-screen flex">
    <Card className="w-[350px] m-auto">
      <form onSubmit={onSubmit}>
      <CardHeader>
        <CardTitle>Create Attendence</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex gap-4 w-full justify-between">

            
            <div className="flex flex-col space-y-1.5 flex-grow">
              <Label htmlFor="departments">Department</Label>
              <Select name="departments" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                  <SelectContent position="item-aligned">
                    {deprtments.map((dept)=> <SelectItem value={dept}>{dept}</SelectItem>)}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5 flex-grow">
              <Label htmlFor="year">Year</Label>
              <Select name="year" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                  <SelectContent position="item-aligned">
                    {[1,2,3,4].map((y)=> <SelectItem value={`${y}`}>{y}</SelectItem>)}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>

            </div>

            <div className="flex items-center space-x-1.5 my-5">
                <Checkbox onClick={(e) => setTimeEnd((time)=> !time)} name="terms" checked={!selectTimeEnd} />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                    Default 1 hours
                </label>
                </div>
            </div>

            <div className="flex gap-3 justify-between">
                <div className="w-full">
                    <Label htmlFor="timeS">Time Start</Label>
                    <Input className="h-24 text-lg" type="time" name="timeS" required
                        onChange={e => setStartTime(e.target.value)} value={startTime}/>
                </div>
                <div className="w-full">
                    <Label htmlFor="timeE">Time Ends</Label>
                    <Input className="h-24 text-lg" type="time" name="timeE" required
                        value={endTime} disabled={!selectTimeEnd} onChange={e => setEndTime(e.target.value)} />
                </div>
            </div>

            

            <div className="flex flex-col space-y-1.5 mt-5">
              <Label htmlFor="timer">Auto Close within</Label>
              <Select name="timer" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                  <SelectContent position='item-aligned'>
                    {timer.map((time)=> <SelectItem value={`${time}`}>{typeof time === 'number' ? `${time} mintues` : time } </SelectItem>)}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={'/'}>
          Cancel
          </Link>
        </Button>
        <Button type="submit">
            Start Now<ChevronRight />
        </Button>
      </CardFooter>
      </form>
    </Card>
    </section>
  )
}
