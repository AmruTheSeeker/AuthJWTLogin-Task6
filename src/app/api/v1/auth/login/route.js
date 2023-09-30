import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

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
        return NextResponse.json({error: "User not found"}, {status : 400})
    } 

    
    // CODE UNTUK CHECK DAN COMPARE PASSWORD
    const hashedPassword = findUser.password
    const isPasswordValid = await bcrypt.compare(password, hashedPassword)

    if(!isPasswordValid){
        return NextResponse.json({error: "Invalid email or password" }, {status: 400});
    }
    
    // Sekarang kita pilih data tertentu saja yang hendak ditampilkan dari user pake payload.
    // Nggak perlu semua ditampilkan, apalagi password, bahaya walaupun sudah di hash.
    const payLoad = {
        id : findUser.id,
        name : findUser.name,
        email : findUser.email,
    }
    
    // Best Practice : Dibikin agar token disimpan didalam cookies browser (inspect -> application -> cookies)
    const accessToken = sign (payLoad,process.env.JWT_SECRET, {expiresIn: "7d"})
    const res = NextResponse.json({ accessToken, data: payLoad, message : "User login successfully" })
    res.cookies.set("token",accessToken);

    return res
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
