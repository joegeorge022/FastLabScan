import { Card, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { SyntheticEvent } from "react"

const Dialoger = ()=> {
    const { toast } = useToast()
    const { push } = useRouter();

    function onSubmit(e: SyntheticEvent) {
      e.preventDefault()

      type input = { value : string }
      type Target = SyntheticEvent['target'] & {password: input }

      // action
      const target = e.target as Target
      console.log(target.password.value)

      toast({
        title: 'Attendence Dashboard Closed',
        description: 'Attendence list is uploaded to the server',
        variant: 'success',
      })

      setTimeout(() => {
        push('/');
      }, 2000)
    }

    return (
      <DialogContent className="py-12">
        <form onSubmit={onSubmit}>
        <DialogHeader>
            <DialogTitle>Close the Attendence</DialogTitle>
            <DialogDescription>
              Enter the password to confirm the action
            </DialogDescription>
          </DialogHeader>
  
          <div className="flex gap-3">
            <Input placeholder="password" name="password" type="password" maxLength={8} minLength={8} className="col-span-3 valid:bg-green-500" required />
          </div>
  
          <DialogFooter>
            <Button type="submit" variant={'destructive'}>Close Now</Button>
          </DialogFooter>
          </form>
      </DialogContent>
    )
  }

const Header = () => {
    return ( 
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
     );
}
 
export default Header;