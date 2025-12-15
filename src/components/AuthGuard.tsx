"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'editor' | 'any';
}

export default function AuthGuard({ children, requiredRole = 'any' }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Get token from localStorage
                const token = localStorage.getItem('auth_token');

                if (!token) {
                    // No token, redirect to login
                    router.push(`/admin-login?redirect=${encodeURIComponent(pathname)}`);
                    return;
                }

                // Verify authentication with backend using Authorization header
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/auth/verify`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();

                    // Check role if required
                    if (requiredRole !== 'any') {
                        const userRole = data.user.role;

                        if (requiredRole === 'admin' && !['admin', 'super_admin'].includes(userRole)) {
                            router.push('/unauthorized');
                            return;
                        }

                        if (requiredRole === 'editor' && !['admin', 'super_admin', 'editor'].includes(userRole)) {
                            router.push('/unauthorized');
                            return;
                        }
                    }

                    // Authorized
                    setIsAuthorized(true);
                } else {
                    // Token invalid - clear and redirect to login
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('admin_user');
                    router.push(`/admin-login?redirect=${encodeURIComponent(pathname)}`);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('admin_user');
                router.push(`/admin-login?redirect=${encodeURIComponent(pathname)}`);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname, requiredRole]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#C4A35A]/30 border-t-[#C4A35A] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
