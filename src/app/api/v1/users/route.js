import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

//Bikin GET dengan Filter query + limit

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const batch = searchParams.get("batch");
  const limit = searchParams.get("limit"); // Sekarang kita tambah fungsi filter limit

  try {
    if (batch || limit) {
      const users = await prisma.user2.findMany({
        // Filtering
        where: {
          batch: {
            // Sekarang kita tambah fungsi filter limit
            contains: batch || "",
          },
        },
        take: Number(limit) || 4,
      });
      return NextResponse.json({
        data: users,
        message: "Users fetched successfully",
      });
    } else {
      const users = await prisma.user2.findMany({


        // SKENARIO 1
        //  posts: true  // ini dimunculkan semua yang ada di dalam table data post
        
        // SKENARIO2
        // include: {
        //   posts:{
        //     select: {  //Ini bisa dipilih data apa yg kita mau dari table data post itu, bukan semuanya
        //       title: true,
        //       content: true,
        //       slug: true
        //     }
        //   }

        // SKENARIO 3
        select: {
          id: true,
          name: true,
          posts: {
            select: {
              title: true,
              content: true,
              slug: true
            }
          }

        }
      }); // Kalau nggak ada akan jalanin fetch semua, tanpa filtering
      return NextResponse.json({
        data: users,
        message: "Users fetched successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "ERROR" }, { status: 500 });
  }
}
