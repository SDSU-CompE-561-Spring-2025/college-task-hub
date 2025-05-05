'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/layout';
import TaskSection from '@/components/tasks/taskSection';
import { TaskType } from '@/types/task';
import { fetchPosterTasks } from '@/lib/api/tasks';

export default function PosterDashboardPage() {
	const [unassignedTasks, setUnassignedTasks] = useState<TaskType[]>([]);
	const [inProgressTasks, setInProgressTasks] = useState<TaskType[]>([]);
	const [pastTasks, setPastTasks] = useState<TaskType[]>([]);

	useEffect(() => {
		const loadTasks = async () => {
			try {
				const myTasks = await fetchPosterTasks();
				setUnassignedTasks(myTasks.filter((t) => t.status === 'unassigned'));
				setInProgressTasks(myTasks.filter((t) => t.status === 'in-progress'));
				setPastTasks(myTasks.filter((t) => t.status === 'completed'));
			} catch (err) {
				console.error('Failed to load poster tasks:', err);
			}
		};

		loadTasks();
	}, []);

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
