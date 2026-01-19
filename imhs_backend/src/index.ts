import { Hono } from 'hono'
import { cors } from 'hono/cors'
import page from './fronendapi'
import esp from './espapi'
const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.route('/page' , page)
app.route('/esp/report' , esp)

export default app
