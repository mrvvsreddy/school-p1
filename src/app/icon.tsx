import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 32, height: 32 };

export default async function Icon() {
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
            // If we have a logo URL, fetch and return it as favicon
            return new ImageResponse(
                (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            overflow: 'hidden',
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={logoUrl}
                            alt="Logo"
                            width={32}
                            height={32}
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                ),
                { ...size }
            );
        }

        // Fallback: Generate a text-based favicon with first letter
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
                        borderRadius: '50%',
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}
                >
                    {logoText.charAt(0).toUpperCase()}
                </div>
            ),
            { ...size }
        );
    } catch (error) {
        console.error('Failed to fetch logo for favicon:', error);
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
                    borderRadius: '50%',
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 'bold',
                }}
            >
                B
            </div>
        ),
        { ...size }
    );
}
