import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'src/data/site-content.json');

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const data = JSON.parse(fileContents);

        // Return with no-cache headers
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error) {
        console.error('Error reading site content:', error);
        return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Read current data
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const currentData = JSON.parse(fileContents);

        // Deep merge for nested objects
        const updatedData = deepMerge(currentData, body);

        // Write updated data
        await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf8');

        // Revalidate all pages that use this data
        try {
            revalidatePath('/');
            revalidatePath('/about');
            revalidatePath('/academics');
            revalidatePath('/facilities');
        } catch (e) {
            // Revalidation might fail in dev mode, that's ok
            console.log('Revalidation attempted');
        }

        return NextResponse.json({ success: true, data: updatedData }, {
            headers: {
                'Cache-Control': 'no-store',
            }
        });
    } catch (error) {
        console.error('Error updating site content:', error);
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}

// Helper function for deep merging objects
function deepMerge(target: any, source: any): any {
    const output = { ...target };

    for (const key in source) {
        if (source[key] instanceof Array) {
            output[key] = source[key];
        } else if (source[key] instanceof Object && key in target) {
            output[key] = deepMerge(target[key], source[key]);
        } else {
            output[key] = source[key];
        }
    }

    return output;
}

