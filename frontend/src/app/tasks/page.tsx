import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';
import TaskCard from '@/components/layout/taskCard';
import JobPostFilterByCategory from '@/components/layout/jobPostFilter'; 

export default function TaskListPage() {
	return (
		<Layout>
			<div className="flex flex-col items-center justify-center min-h-screen text-black p-8 gap-8">
				<TaskCard />

				<h1 className="text-2xl font-bold">Available Tasks</h1>

				{/* This is the filter component */}
				<JobPostFilterByCategory />

				<ul className="mt-4 space-y-2 underline text-blue-600">
					<li>
						<Link href="/tasks/123">Job Example 1</Link>
					</li>
					<li>
						<Link href="/tasks/124">Job Example 2</Link>
					</li>
				</ul>
			</div>
		</Layout>
	);
}
