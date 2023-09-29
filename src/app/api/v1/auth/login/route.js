import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email, password } = await req.json();

  try {

    const findUser = await prisma.member.findUnique({
        where: {
            email
        }
    })

    // CODE TO CHECK IF USER EXIST 
    // if (findUser === null) cara 1
    if (!findUser) {   //cara 2, ingat mulai dari jika gagal atau not found dulu
        return NextResponse.json({message: "User not found"})
    } 
    
    // CODE UNTUK CHECK DAN COMPARE PASSWORD
    const hashedPassword = findUser.password
    const isPasswordValid = await bcrypt.compare(password,hashedPassword)

    if(!isPasswordValid){
        return NextResponse.json({message: "Invalid Password" });
    }
    
    // Sekarang kita pilih data tertentu saja yang hendak ditampilkan dari user pake payload.
    // Nggak perlu semua ditampilkan, apalagi password, bahaya walaupun sudah di hash.
    const payLoad = {
        id : findUser.id,
        name : findUser.name,
        email : findUser.email,
    }
    return NextResponse.json({ data: payLoad });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
  return NextResponse.json({ message: "Hello world!" });
}
