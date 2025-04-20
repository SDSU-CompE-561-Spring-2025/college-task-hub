import Link from 'next/link';

import React from 'react';
import Layout from '@/components/layout/layout';

export default function Home() {
	return (
		<div>
			<Layout>
				<div className="flex flex-col items-center justify-center min-h-screen text-black">
					<h1> Home Page</h1>
					<h2>
						<Link href="/auth/sign-in">Sign in</Link>
						<br />
						<Link href="/auth/sign-up">Sign up</Link>
						<br />
						<Link href="/dashboard/poster">Post Tasks</Link>
						<br />
						<Link href="/dashboard/performer">Do Tasks</Link>
						<br />
					</h2>
				</div>
			</Layout>
		</div>
	);
}
