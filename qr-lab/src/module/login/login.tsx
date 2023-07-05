import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@/lib/types"
import { ChevronRight } from "lucide-react"
import { SyntheticEvent } from "react"

type Props = {
  setUser : (user:User) => void
}
export default function Login(Props:Props) {

  const onSubmit = (e:SyntheticEvent) => {
    type input = { value : string }
    type target = SyntheticEvent['target'] & {email: input, password :input }

    e.preventDefault()
    const target = e.target as target

    let user = {
      email: target.email.value,
      dprt: 'EI' as User['workplace'],

      workplace: 'AD' as User['workplace'],
      name : 'rajat' as string
    }

    Props.setUser(user)
    console.log(user)
  }

  return (
    <section className="w-full h-screen flex">
    <Card className="w-[350px] m-auto">
      <form onSubmit={onSubmit}>
      <CardHeader>
        <CardTitle>Login to your Account</CardTitle>
        <CardDescription>Use your email id provided by SJCET PALAI.</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" placeholder="example@sjcetpalai.ac.in" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" placeholder="**** ****" />
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit">
            Login<ChevronRight />
        </Button>
      </CardFooter>
        </form>
    </Card>
    </section>
  )
}
