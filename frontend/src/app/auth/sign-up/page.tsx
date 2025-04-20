import React from 'react';
import Layout from '@/components/layout/layout';
import SignUpCard from '@/components/layout/signUpCard';

// NOTE:
// This will be implemented as a modal pop-up on top of the Home page.
// Keeping this route so users can still go directly to /auth/sign-up if needed.
export default function SignUpPage() {
	return (
		<div>
			<Layout>
				<div className="flex flex-col items-center justify-center min-h-screen text-black">
					<SignUpCard />
				</div>
			</Layout>
		</div>
	);
}
