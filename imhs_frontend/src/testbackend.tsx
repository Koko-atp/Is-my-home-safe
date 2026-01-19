import { db_api } from "./app_env";
import { useEffect, useState } from "react";

interface testms{
    message : string
    status : string
}

function Testbe() {
const [testbackend , settest] = useState<testms[]>([])
     
useEffect(() => {
    const fetchbackend = async () => {
    try {
        const res = await fetch(`${db_api}`)
        if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json() 
        settest([data])
        console.log(data)                 
    } catch (e: any) { console.error('Error fetching backend:', e.message)}}
    fetchbackend();
    
},[] )

return(
        <>
          <table border={1} style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th> From </th>
          <th> Status </th>
        </tr>
      </thead>
      <tbody>
        {testbackend.map(testbackend => (
          <tr>
            <td>  {testbackend.message}   </td>
            <td>{testbackend.status}</td>
          </tr> ))}
      </tbody>
    </table>

    </>
    )
}
export default Testbe