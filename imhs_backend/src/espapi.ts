import { Hono } from "hono";
const esp = new Hono()

esp.post('/tempeture' , (c) => {
    const statin = c.req.json()
    
})