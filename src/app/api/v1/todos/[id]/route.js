import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function PATCH(req, { params }) {
  const { id } = params; //untuk ambil dynamic Id
  const { content } = await req.json(); //untuk ambil body content nya

  try {
    const updateToDo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
    return NextResponse.json({
      data: updateToDo,
      message: "Todo updated successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "ERROR" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params; //untuk ambil dynamic Id

  try {
    const deleteTodo = await prisma.todo.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({data: deleteTodo,message: "Todo deleted successfully",});

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "ERROR" }, { status: 500 });
  }
}
