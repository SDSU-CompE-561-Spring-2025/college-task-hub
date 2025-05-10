// components/auth/ProtectedRoute.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({
	children,
	role,
}: {
	children: React.ReactNode;
	role: 'poster' | 'performer';
}) {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem('access_token');
		if (!token) {
			router.push(`/?showSignIn=${role}`);
		} else {
			setIsChecking(false);
		}
	}, [router, role]);

	if (isChecking) return null;

	return <>{children}</>;
}
