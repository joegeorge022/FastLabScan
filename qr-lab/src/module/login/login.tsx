import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight } from "lucide-react"

export default function Login() {
  return (
    <section className="w-full h-screen flex">
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Login to your Account</CardTitle>
        <CardDescription>Use your email id provided by SJCET PALAI.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" placeholder="example@sjcetpalai.ac.in" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input type="password" placeholder="**** ****" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>
            Login<ChevronRight />
        </Button>
      </CardFooter>
    </Card>
    </section>
  )
}
