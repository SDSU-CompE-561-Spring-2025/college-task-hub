import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';

// NOTE:
// This will be implemented as a modal pop-up on top of the Home page.
// Keeping this route so users can still go directly to /auth/sign-up if needed.
export default function SignUpPage() {
	return (
		<div>
			<Layout>
				<h1>SignUp Page</h1>
				<h2>
					<Link href="/auth/sign-in">Already have an account? Sign in</Link>
				</h2>
			</Layout>
		</div>
	);
}
