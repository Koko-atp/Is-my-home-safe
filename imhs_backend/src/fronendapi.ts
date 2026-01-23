import { Hono } from "hono"
import { z} from 'zod'
import { zValidator as zv  } from "@hono/zod-validator"

// ================================ User =============================
const createitfCreate = z.object({
    name : z.string().min(4 , "must be atleast 4 charactor"),
    email : z.email("email is in correct or missing")
})


const page = new Hono;
const callDB = (c:any , exc:string)  => c.env.IMHS_DB.prepare(exc)

page.get('/users' , async (c) => {
    const getallsending = await callDB(c, "SELECT * FROM user").all()

    console.log(getallsending )
    return c.json({"users" : getallsending.results})
})
page.post('/user/create', 
    zv('json' , createitfCreate) ,
    async (c) => {
    try{
        const User = c.req.valid('json')
        const create = await callDB(c , 
            "INSERT INTO User (name , email) VALUES(? , ? )")
        .bind(
            User.name , 
            User.email
        ).run()
        c.status(201)
        console.log(create.meta)
        return c.json({created : User})
    } catch(e:any ){
        c.status(500)
        return c.json({error : e.message})
}})

// ================================ Room =============================
const roomitfcreate = z.object({
    uid : z.int("missing param") ,
    Name : z.string("Need name for this room").min(4 , "need to be atleast 4 charactor"),
    House : z.string("need house name for this room")
})

page.post('/Room/create/:uid' ,
    zv('json' , 
    roomitfcreate) , async (c) => {
    try{
        const body  = c.req.valid('json');
        const hid = await callDB(c , "SELECT H_id from Home WHERE U_id = ? AND H_name = ?").bind(body.uid , body.House).run()
        const createRoom  = await callDB(c 
            , "INSERT INTO Room(r_name , H_id) values( ? , ?)")
        .bind(
            body.Name,
            hid.results[0].H_id
        ).run();

        c.status(201);
        console.log(createRoom.meta)
        return c.json({created : body});
    }catch(e:any){ 
        c.status(500);
        return c.json({error : e.massage}); 
    }
})


// ================================ House =============================


const housecreate = z.object({
    uid : z.int("missing param") , 
    Name : z.string("require name for this House")
    .min(4 ,"need to be atleast 4 character")
})
page.post('/Home/create' , 
    zv('json' , housecreate) ,
    async  (c) => {
    try {
        const body = c.req.valid('json')
                
        const conf = await callDB(c , `SELECT COUNT(H_id) as count FROM Home WHERE U_id = ? and H_name = ? `)
        .bind( body.uid , body.Name).all();

        if ( conf.count > 0 ){
                c.status(409);
                const e = {error : "This house already exist"}  
                console.log({error : "This house already exist" ,
                    confic : { House_name : body.Name , User_id : body.uid}
                })
                return c.json(e)
        }

        else {
            const createhouse = await callDB(c ,
                "INSERT INTO Home ( H_name , U_id ) VALUES (? , ? )" )
                .bind(
                    body.Name,
                    body.uid
                ).run()
                
                c.status(201)
                console.log(createhouse)
                return c.json({created : body})
            }

    }catch(e:any){

        c.status(500);
        return c.json({error : e}); 
    }
})
// ============================================= Borad =============================

const Bbodycreate  = z.object ({
    uid : z.int("missing param user"),
    name : z.string("Need a namefor board"),
    rid :  z.int("missing param room") , 
    Hid  :   z.int("Missing param house") 
} )


page.post('/Board/create' , 
    zv('json' , Bbodycreate) , async (c) => {
        try {
            const body = c.req.valid('json')

            const exist = await callDB(c , `SELECT COUNT(r.r_id) as count FROM Room r 
                INNER JOIN Home h ON r.H_id = h.H-id
                INNER JOIN User u  ON h.U_id = u.u_id
                WHERE u.U_id = ? AND r.r_id = ? and H_id = ? `)
                .bind( body.uid , body.rid , body.Hid).all()

            if (exist.count <= 0 ){
                return c.json({error : "room not found"})
            }
            else { 
                const results = await callDB(c , `INSERT INTO  Board (B_name , r_id , status)
                    VALUES (?,?,?)`).bind 
                .bind(
                    body.name,
                    body.rid,
                    0 ).run()

                console.log(results.meta);
                c.status(201);
                return c.json({ result : "created"})
            }
        }catch(e:any){
            console.log({ error : e.message})
            return c.json ({result : "error" })
        }
    })



export default page ; 