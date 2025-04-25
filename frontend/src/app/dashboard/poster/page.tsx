import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';

export default function PosterDashboardPage() {
	return (
		<div>
			<Layout>
				<div>
					<h1>Poster Dashboard</h1>
					<ul>
						{/*
            Replace this list with a map function that pulls
            the poster's active and past jobs from the backend.
          */}
						<li>
							<Link href="/tasks/7">Clean House</Link>
						</li>
						<li>
							<Link href="/tasks/8">Assemble Furniture</Link>
						</li>
						<li>
							<Link href="/tasks/9">Pick Up Groceries</Link>
						</li>
					</ul>

					{/* A pop up should appear when clicking "Post a task" so no link included. */}
				</div>
			</Layout>
		</div>
	);
}
