import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';
import AddressBar from '@/components/ui/addressBar';


export default function Home() {
	return (
		<div>
			<Layout isHomePage={true}>
				<div className="flex flex-col items-center justify-center text-black">
				<div className="pt-12">
        			<AddressBar />
      			</div>
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
