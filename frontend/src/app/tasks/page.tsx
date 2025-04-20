import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';

export default function TaskListPage() {
	return (
		<div>
			<Layout>
				<div>
					<h1>Available Tasks</h1>
					<ul>
						<li>
							<Link href="/tasks/123">Job Example 1</Link>
						</li>
						<li>
							<Link href="/tasks/124">Job Example 2</Link>
						</li>
					</ul>
				</div>
			</Layout>
		</div>
	);
}
