import fastify from "fastify";

const app = fastify()
app.get("/algo",(Request,Response)=>{
  return "hello World"
})
app.listen({
    port:3000
}).then(()=>{
    console.log("App Running")
})