import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
        where: { email }
    });

    if (existingUser) {
        return NextResponse.json({ message: "User already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(newUser);
    } catch (error) {
        return NextResponse.json({ message: "Error creating user" }, { status: 500 });
    }
}
