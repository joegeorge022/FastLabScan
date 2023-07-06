import { Dash } from "@/lib/types"
import Create from "@/module/create/create"
import Dashboard from "@/module/home/dashboard"
import { useState } from "react"




export default function Home(){
    const [dash, setDash] = useState<Dash | null>(null)
    // console.log(user)
    return (
        <>
            {dash ?  <Dashboard dash={dash} /> : <Create setDash={setDash} /> }
        </>
    )
}