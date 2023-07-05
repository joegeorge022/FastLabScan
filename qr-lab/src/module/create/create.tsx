import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { hourUp } from "@/lib/time"
import { ChevronRight } from "lucide-react"

const deprtments = [
    'AD', 'CSE', 'EEE', 'ECS', 'CYB', 'CE', 'ECE', 'ME', 'EI'
]

const timer = [ 5,10,15,20,25, 'Manual' ]


export default function Create() {
    const [selectTimeEnd, setTimeEnd] = useState(false)
    const [endTime, setEndTime] = useState('')
    const [startTime, setStartTime] = useState('')

    useEffect(() => {
        if (!selectTimeEnd && startTime !== '')
            setEndTime(hourUp(startTime))
            
    }, [startTime, selectTimeEnd]);

  return (
    <section className="w-full h-screen flex">
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Create Attendence</CardTitle>
        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="departments">Department</Label>
              <Select name="departments">
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                  <SelectContent position="item-aligned">
                    {deprtments.map((dept)=> <SelectItem value={dept}>{dept}</SelectItem>)}
                  </SelectContent>
                </SelectTrigger>
              </Select>
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
                    <Input className="h-24 text-lg" type="time" name="timeS" 
                        onChange={e => setStartTime(e.target.value)} value={startTime}/>
                </div>
                <div className="w-full">
                    <Label htmlFor="timeE">Time Ends</Label>
                    <Input className="h-24 text-lg" type="time" name="timeE"
                        value={endTime} disabled={!selectTimeEnd} onChange={e => setEndTime(e.target.value)} />
                </div>
            </div>

            

            <div className="flex flex-col space-y-1.5 mt-5">
              <Label htmlFor="timer">Auto Close within</Label>
              <Select name="timer">
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                  <SelectContent position='item-aligned'>
                    {timer.map((time)=> <SelectItem value={`${time}`}>{typeof time === 'number' ? `${time} mintues` : time } </SelectItem>)}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>
            Start Now<ChevronRight />
        </Button>
      </CardFooter>
    </Card>
    </section>
  )
}
