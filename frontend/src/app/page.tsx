import React from 'react';
import Layout from '@/components/layout/layout';

export default function Home() {
	return (
		<div>
			<Layout>
				<div className="flex flex-col items-center justify-center min-h-screen text-black">
					<h1 className="text-5xl font-bold mb-4">Welcome to TaskU</h1>
					<p className="text-xl mb-8">Your task management solution.</p>
				</div>
			</Layout>
		</div>
	);
}
