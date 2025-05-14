import React from 'react';
import Layout from '@/components/layout/layout';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/protectedRoute';

export default function ProfilePage() {
	return (
		<div>
			<ProtectedRoute role="poster">
				<Layout>
					<div className="flex flex-col items-center justify-center min-h-screen text-black">
						<h1>Main Dashboard Page</h1>
						<li>
							<Link href="/dashboard/poster">Poster</Link>
						</li>
						<li>
							<Link href="/dashboard/performer">Performer</Link>
						</li>
					</div>
				</Layout>
			</ProtectedRoute>
		</div>
	);
}
