import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

const callDB = (c:any) => c.env.IMHS_DB
app.get('/', (c) => {
  return c.json( {message : `    ${c.req.url}   `  , status :   '✨   responding!    👹'})
})


app.get('/users' , async (c) => {
  return c.text('Hello Hono !')
})

app.post('/users', async (c) => {
  try{
  const body = await c.req.json()


  if (!body.name || !body.email) {
      return c.json({ error: 'Missing name or email' }, 400)
  }

  await callDB(c).prepare(
      'INSERT INTO users (name, email) VALUES (?, ?)'
  ).bind(body.name, body.email).run()

  return c.json({ message: 'User added successfully' }, 201) 
  } catch (err: any) {


    return c.json({ error: 'Failed to add user',
      info : err
     }, 500)
  }
})


export default app
