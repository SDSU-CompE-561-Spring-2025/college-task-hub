'use client';

import React from 'react';
import Layout from '@/components/layout/layout';
import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/auth/protectedRoute';

// Dynamically import the JobPostForm with ssr: false to ensure it's rendered only on the client
const JobPostForm = dynamic(() => import('@/components/job-post/jobPostForm'), { ssr: false });

export default function JobPostPage() {
	return (
		<ProtectedRoute role="poster">
			<Layout>
				<div className="max-w-3xl mx-auto p-6 my-8 rounded-lg bg-gray-100">
					<h1 className="text-2xl font-bold mb-6">Post a Job</h1>
					<JobPostForm />
				</div>
			</Layout>
		</ProtectedRoute>
	);
}
