import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';

export default function PerformerDashboardPage() {
	return (
		<div>
			<Layout>
				<div>
					<h1>Task Suggestions</h1>
					<ul>
						{/*
				  Eventually this should pull from the database.
				  For now, these are placeholder links.
			*/}
						<li>
							<Link href="/tasks/1">Unload Uhaul</Link>
						</li>
						<li>
							<Link href="/tasks/2">Build Bunk Bed</Link>
						</li>
						<li>
							<Link href="/tasks/3">Pull Weeds</Link>
						</li>
						<li>
							<Link href="/tasks/4">Walk Two Dogs</Link>
						</li>
						<li>
							<Link href="/tasks/5">Cat Sit</Link>
						</li>
						<li>
							<Link href="/tasks/6">Take Dog To The Dog Park</Link>
						</li>
					</ul>
				</div>
			</Layout>
		</div>
	);
}
