'use client';

import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import Layout from '@/components/layout/layout';
import PostTasks from '@/app/tasks/post/page';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TaskSection from '@/components/tasks/taskSection';

export default function PosterDashboardPage() {

	const [unassignedTasks, setUnassignedTasks] = useState(['Task 1', 'Task 2', 'Task 3', 'Task 7']);
  	const [inProgressTasks, setInProgressTasks] = useState(['Task 4', 'Task 5']);
  	const [pastTasks, setPastTasks] = useState(['Task 6']);

	return (
		<div>
			<Layout>
				<div className="flex flex-col items-center justify-center text-black mb-8">

					<h1 className="text-3xl font-semibold mt-8 mb-4">My Listings</h1>
					<TaskSection 
						title="Unassigned"
						tasks={unassignedTasks}
						setTasks={setUnassignedTasks}
					/>

					<TaskSection 
						title="In Progress"
						tasks={inProgressTasks}
						setTasks={setInProgressTasks}
					/>

					<TaskSection
						title="Past"
						tasks={pastTasks}
						setTasks={setPastTasks}
					/>
				</div>
			</Layout>
		</div>
	);
}
