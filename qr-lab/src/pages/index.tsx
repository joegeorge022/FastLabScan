import Login from "@/module/login/login"
import { useLocalStorage } from "@/lib/custom-hooks"
import HomeTable from "@/module/home/homeTable"
import { User } from "@/lib/types"

export default function Home(){
    const [user, setUser] = useLocalStorage<User | null>('user', null)
    console.log(user)
    return (
        <>
            {user ? <HomeTable user={user} setUser={setUser} /> : <Login setUser={setUser} />}
        </>
    )
}