import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const ext = path.extname(file.name);
        const filename = `${timestamp}${ext}`;
        const filepath = path.join(uploadsDir, filename);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Return the public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({ url, success: true });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
