import { fastify } from "fastify"
import fastifyCors from "@fastify/cors"
import { prisma } from "./lib/prisma"
import { z } from "zod"

const app = fastify()

app.register(fastifyCors, {
    origin: '*'
})

app.get("/post", async (request, reply)=>{
    const posts = await prisma.post.findMany()

    return { posts }
})

app.post("/post", async (request, reply)=>{
    const createPostSchema = z.object({
        title: z.string(),
        description: z.string()
    }) 

    const { title, description } = createPostSchema.parse(request.body)

    const post = await prisma.post.create({
        data:{
            title,
            description
        }
    })

    return reply.status(201).send({post})
})

app.get("/post/:id", async (request, reply)=>{
    const idSchema = z.object({
        id: z.coerce.number()
    }) 

    const { id } = idSchema.parse(request.params)

    const post = await prisma.post.findUnique({
        where:{
            id
        }
    })

    return reply.status(200).send({post})
})

app.delete("/post/:id", async (request, reply)=>{
    const idSchema = z.object({
        id: z.coerce.number()
    }) 

    const { id } = idSchema.parse(request.params)

    const post = await prisma.post.delete({
        where:{
            id
        }
    })

    return reply.status(200).send({"message": "deleted success"})
})

app.put("/post/:id", async (request, reply)=>{
    const idSchema = z.object({
        id: z.coerce.number()
    }) 

    const { id } = idSchema.parse(request.params)
    
    const createPostSchema = z.object({
        title: z.string(),
        description: z.string()
    }) 

    const { title, description } = createPostSchema.parse(request.body)

    const post = await prisma.post.update({
        where:{
            id
        },
        data:{
            title,
            description
        }
    })

    return reply.status(200).send(post)
})

app.listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3333 
}).then(()=> console.log("👌 Server Team SIEd is running...✌️"))