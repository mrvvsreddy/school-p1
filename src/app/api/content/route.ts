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
        } catch {
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
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
    const output = { ...target };

    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (sourceValue instanceof Array) {
            output[key] = sourceValue;
        } else if (
            sourceValue instanceof Object &&
            key in target &&
            targetValue instanceof Object &&
            !(targetValue instanceof Array)
        ) {
            output[key] = deepMerge(
                targetValue as Record<string, unknown>,
                sourceValue as Record<string, unknown>
            );
        } else {
            output[key] = sourceValue;
        }
    }

    return output;
}

