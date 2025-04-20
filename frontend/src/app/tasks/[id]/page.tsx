import React from 'react';
import Layout from '@/components/layout/layout';

export default async function JobPostPage({ params }: { params: { id: string } }) {
	// Explicitly await params before destructuring
	const { id } = await Promise.resolve(params);

	return (
		<div>
			<Layout>
				<div>
					<h1>Job Post</h1>
					<p>Job ID: {id}</p>
				</div>
			</Layout>
		</div>
	);
}
