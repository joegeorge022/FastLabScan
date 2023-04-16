type Data = { name: string, reg: string }

const Profile = ({data} :any) => {
    return ( 
        <div className="d-flex flex-col">
            <p>{data.name}</p>
            <p>{data.reg}</p>
        </div>
     );
}
 
export default Profile;