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
    return c.json({"getting it" : getallsending.results})
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
    Name : z.string("Need name for this room").min(4 , "need to be atleast 4 charactor"),
    House : z.string("need house name for this room")
})

page.post('/Room/create/:uid' ,
    zv('json' , 
    roomitfcreate) , async (c) => {
    try{
        const uid = c.req.param('uid')
        const newroom = c.req.valid('json');
        const hid = await callDB(c , "SELECT H_id from Home WHERE U_id = ? AND H_name = ?").bind(uid , newroom.House).run()
        const createRoom  = await callDB(c 
            , "INSERT INTO Room(r_name , H_id) values( ? , ?)")
        .bind(
            newroom.Name,
            hid.results[0].H_id
        ).run();

        c.status(201);
        console.log(createRoom.meta)
        return c.json({created : newroom});
    }catch(e:any){ 
        c.status(500);
        return c.json({error : e.massage}); 
    }
})


// ================================ House =============================


const housecreate = z.object({
    Name : z.string("require name for this House")
    .min(4 ,"need to be atleast 4 character")
})

page.post('/Home/create/:uid' , 
    zv('json' , housecreate) ,
    async  (c) => {
    try {
        const uid = c.req.param('uid');
        const newhouse = c.req.valid('json')
        const createhouse = await callDB(c ,
            "INSERT INTO Home ( H_name , U_id ) VALUES (? , ? )")
        .bind(
            newhouse.Name,
            uid
        ).run()
        c.status(201)
        console.log(createhouse.meta)
        return c.json({created : newhouse})
    }catch(e:any){ 
        c.status(500);
        return c.json({error : e.massage}); 
    }
})


export default page ; 