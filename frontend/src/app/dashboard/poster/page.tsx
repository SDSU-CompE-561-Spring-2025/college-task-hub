'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/layout';
import TaskSection from '@/components/tasks/taskSection';
import { TaskType } from '@/types/task';
import { fetchPosterTasks } from '@/lib/api/tasks';
import { fetchApplicationsForTask } from '@/lib/api/applications';
import TaskApplicationsSection from '@/components/tasks/taskApplicationSection';

export default function PosterDashboardPage() {
	const [unassignedTasks, setUnassignedTasks] = useState<TaskType[]>([]);
	const [inProgressTasks, setInProgressTasks] = useState<TaskType[]>([]);
	const [pastTasks, setPastTasks] = useState<TaskType[]>([]);
	const [applicationsByTask, setApplicationsByTask] = useState<{ [taskId: number]: any[] }>({}); // Storing applications by taskId

	useEffect(() => {
		const loadTasks = async () => {
			try {
				const myTasks = await fetchPosterTasks();
				setUnassignedTasks(myTasks.filter((t) => t.status === 'unassigned'));
				setInProgressTasks(myTasks.filter((t) => t.status === 'in-progress'));
				setPastTasks(myTasks.filter((t) => t.status === 'completed'));
				
				// After tasks are loaded, load applications for each task
				myTasks.forEach((task) => {
					loadApplications(task.id); // Call the function for each task's ID
				});
			} catch (err) {
				console.error('Failed to load poster tasks:', err);
			}
		};

		const loadApplications = async (taskId: number) => {
			try {
				console.log("Getting token");
				const token = localStorage.getItem('access_token');
				if (!token) return;

				const apps = await fetchApplicationsForTask(taskId, token);
				console.log("Applications for Task:", apps); // Log applications for debugging

				// Update the applications state for each task
				setApplicationsByTask((prevState) => ({
					...prevState,
					[taskId]: apps, // Store applications by taskId
				}));
			} catch (err) {
				console.error('Failed to load applications for task:', err);
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

					<div className="w-6/10 mt-8 flex flex-col items-center justify-center">
						<h1 className="text-3xl font-semibold mt-8 mb-4">My Applications</h1>

						{Object.keys(applicationsByTask).length > 0 ? (
							<div className="flex flex-col gap-4 w-full">
								{Object.entries(applicationsByTask).map(([taskId, applications]) => (
									<TaskApplicationsSection
										key={taskId}
										taskId={Number(taskId)}
										applications={applications}
										taskTitle={taskId}
									/>
								))}
							</div>
						) : (
							<p>No applications yet.</p>
						)}
					</div>

					
				</div>
			</Layout>
		</div>
	);
}
