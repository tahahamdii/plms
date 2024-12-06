import { db } from "@/libs/db";
import { error } from "console"
import { NextRequest, NextResponse } from "next/server";
import { title } from "process";

export async function POST(
    req : Request,
) {
    try {

        const userId = "1";
        const {title} = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized" , {status: 401});

        }

        const course = await db.course.create({
            data:{
                userId,
                title,
            }
        });

        return NextResponse.json(course);
    } catch (err) {
        console.log("[COURSES]", err);
        return new NextResponse("Internal error",{status : 500})
    }
}