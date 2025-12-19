import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 180, height: 180 };

export default async function AppleIcon() {
    // Fetch the logo from the database
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
        const res = await fetch(`${apiUrl}/api/pages/shared`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        const data = await res.json();
        const logoUrl = data.header?.logo?.image;
        const logoText = data.header?.logo?.text || 'B';

        if (logoUrl) {
            // If we have a logo URL, fetch and return it as apple icon
            return new ImageResponse(
                (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#C4A35A',
                            borderRadius: '20%',
                            overflow: 'hidden',
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={logoUrl}
                            alt="Logo"
                            width={160}
                            height={160}
                            style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                    </div>
                ),
                { ...size }
            );
        }

        // Fallback: Generate a text-based icon with first letter
        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#C4A35A',
                        borderRadius: '20%',
                        color: 'white',
                        fontSize: 100,
                        fontWeight: 'bold',
                    }}
                >
                    {logoText.charAt(0).toUpperCase()}
                </div>
            ),
            { ...size }
        );
    } catch (error) {
        console.error('Failed to fetch logo for apple icon:', error);
    }

    // Fallback if fetch fails
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#C4A35A',
                    borderRadius: '20%',
                    color: 'white',
                    fontSize: 100,
                    fontWeight: 'bold',
                }}
            >
                B
            </div>
        ),
        { ...size }
    );
}
