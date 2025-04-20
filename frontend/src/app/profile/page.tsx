import React from 'react';
import Layout from '@/components/layout/layout';

//The contact information and reviews will be pop ups so no routing needed
export default function ProfilePage() {
	return (
		<div>
			<Layout>
				<div className="flex flex-col items-center justify-center min-h-screen text-black">
					<h1>Profile Page</h1>
				</div>
			</Layout>
		</div>
	);
}
