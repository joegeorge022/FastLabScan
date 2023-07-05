import { useLocalStorage } from "@/lib/custom-hooks"
import { User } from "@/lib/types"
import Create from "@/module/create/create"
import Dashboard from "@/module/home/dashboard"
import { useState } from "react"

export type dash = {     
    dprt: User['dprt']
    timer: string,
    starts: string,
    ends: string
}


export default function Home(){
    const [dash, setDash] = useState<dash | null>(null)
    // console.log(user)
    return (
        <>
            {dash ?  <Dashboard dash={dash} /> : <Create setDash={setDash} /> }
        </>
    )
}