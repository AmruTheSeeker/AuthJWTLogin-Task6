import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt"

export async function POST (req) {
        const {name, email, password} = await req.json()

    try {
        const hashedPassword = await bcrypt.hash(password, 13)

        const createMember = await prisma.member.create({
            data: {
                name, 
                email, 
                password: hashedPassword,
            }
        })

        return NextResponse.json({data: createMember, message: "member created successfully"}, {status: 201})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error}, {status : 500})
        
    }
}