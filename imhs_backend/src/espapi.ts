import { Hono } from "hono";




const esp = new Hono()
const callDB = (c:any , exc:string)  => c.env.IMHS_DB.prepare(exc)


esp.post('/report/tempeture' , (c) => {
    const statin = c.req.json()
    return c.text("gotit")
})



export default esp