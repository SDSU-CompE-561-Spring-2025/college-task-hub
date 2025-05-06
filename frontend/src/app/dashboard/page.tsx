import React from 'react';
import Layout from '@/components/layout/layout';
import Link from 'next/link';

export default function ProfilePage() {
	return (
		<div>
			<Layout>
				<div className="flex flex-col items-center justify-start min-h-screen text-black pt-20">
					<h1 className="text-2xl font-bold mb-12">Main Dashboard Page</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Link href="/dashboard/poster" className="block">
							<div className="bg-blue-100 hover:bg-blue-200 transition-colors duration-200 p-6 rounded-lg shadow-md w-64 text-center">
								<h2 className="text-xl font-semibold text-blue-800">Poster</h2>
								<p className="text-blue-600 mt-2">Create and manage your posts</p>
							</div>
						</Link>
						<Link href="/dashboard/performer" className="block">
							<div className="bg-blue-100 hover:bg-blue-200 transition-colors duration-200 p-6 rounded-lg shadow-md w-64 text-center">
								<h2 className="text-xl font-semibold text-blue-800">Performer</h2>
								<p className="text-blue-600 mt-2">View and manage performances</p>
							</div>
						</Link>
					</div>
				</div>
			</Layout>
		</div>
	);
}
