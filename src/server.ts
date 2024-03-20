import fastify from "fastify";
import {  z } from "zod";
import { sql } from "./postgres";
import postgres from "postgres";
import { redis } from "./redis";



const app = fastify();

app.get("/:code", async(request,reply)=>{
  const getLinksSchemas= z.object({
    code:z.string().min(3)
  })
  const {code} = getLinksSchemas.parse(request.params)
  const result = await sql/*sql*/`SELECT id,original_url FROM short_links WHERE short_links.code=${code}`

  const link=result[0]
  
  if(link.length === 0){
    reply.status(400).send({msg:"link Not Found"})
  }
  await redis.zIncrBy('metrics',1,String(link.id))
 reply.redirect(301,link.original_url)
})
app.get('/api/links/',async()=>{
  const result= await sql/*sql*/`SELECT * FROM short_links ORDER BY created_at DESC`
  return result
})
app.post("/api/links/", async(request,reply) => {
	const creatLinksSchemas = z.object({
		code: z.string().min(3),
		url: z.string().url(),
	});
  const {code , url}= creatLinksSchemas.parse(request.body)

  try {
    const result = await sql/*sql*/`INSERT INTO short_links(code,original_url)VALUES(${code},${url}) RETURNING id`

  const link = result[0]
  
  return reply.status(201).send({shortLinkId : link.id })

  } catch (error) {
    if(error instanceof postgres.PostgresError){
      if(error.code === '23505')
      reply.status(400).send({msg:"Duplicated code!"})
    }
    console.log(error)
    reply.status(500).send({msg:"Internal Server"})
  }
 
});
app
	.listen({
		port: 3000,
	})
	.then(() => {
		console.log("App Running");
	});
