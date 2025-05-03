import React from 'react';
import Layout from '@/components/layout/layout';
import SignInCard from '@/components/layout/signInDialog';

// NOTE:
// This will be implemented as a modal pop-up on top of the Home page.
// Keeping this route so users can still go directly to /auth/sign-in if needed.
export default function SignInPage() {
	return (
		<div>
			<Layout>
				<div className="flex flex-col items-center justify-center min-h-screen text-black">
					<SignInCard />
				</div>
			</Layout>
		</div>
	);
}
