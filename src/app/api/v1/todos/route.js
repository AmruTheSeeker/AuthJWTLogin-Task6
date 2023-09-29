import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";


//Bikin GET
export async function GET() {

    try {
        const todos = await prisma.todo.findMany()
        return NextResponse.json({data: todos})

    } catch (error) {
        console.log(error)
        return NextResponse.json ({message : "ERROR"}, {status : 500})

    }
}

//Bikin CREATE atau POST
export async function POST (req){
    const {content} = await req.json()
    try {
        const createTodo = await prisma.todo.create({
            data: {
                content //content ambil dari body, makanya bikin const content dulu di atas
            }
        })
        return NextResponse.json({data : createTodo, message : "Todo create successfully"}, {status: 201})

    } catch (error) {
         console.log(error);
         return NextResponse.json({ message: "ERROR" }, { status: 500 });
    }

}