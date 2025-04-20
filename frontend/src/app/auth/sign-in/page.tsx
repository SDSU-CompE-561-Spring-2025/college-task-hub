import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';

// NOTE:
// This will be implemented as a modal pop-up on top of the Home page.
// Keeping this route so users can still go directly to /auth/sign-in if needed.
export default function SignInPage() {
	return (
		<div>
			<Layout>
				<div>
					<h1>Sign In Page</h1>
					<Link href="/auth/sign-up">New to TaskU? Sign Up</Link>
					<br />
					<Link href="/auth/forgot-password">Forgot Password?</Link>
				</div>
			</Layout>
		</div>
	);
}
