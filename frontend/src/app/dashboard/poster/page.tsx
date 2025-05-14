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
	const [taskTitles, setTaskTitles] = useState<{ [taskId: number]: string }>({}); // Store task titles

	useEffect(() => {
		const loadTasks = async () => {
			try {
				const myTasks = await fetchPosterTasks();
				setUnassignedTasks(myTasks.filter((t) => t.status === 'unassigned'));
				setInProgressTasks(myTasks.filter((t) => t.status === 'in-progress'));
				setPastTasks(myTasks.filter((t) => t.status === 'completed'));
				
				// Create a map of task IDs to titles
				const titles = myTasks.reduce((acc, task) => ({
					...acc,
					[task.id]: task.title
				}), {});
				setTaskTitles(titles);
				
				// After tasks are loaded, load applications for each task
				myTasks.forEach((task) => {
					loadApplications(task.id);
				});
			} catch (err) {
				console.error('Failed to load poster tasks:', err);
			}
		};

		const loadApplications = async (taskId: number) => {
			try {
				const token = localStorage.getItem('access_token');
				if (!token) return;

				const apps = await fetchApplicationsForTask(taskId, token);
				setApplicationsByTask((prevState) => ({
					...prevState,
					[taskId]: apps,
				}));
			} catch (err) {
				console.error('Failed to load applications for task:', err);
			}
		};

		loadTasks();
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
			<Layout>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header Section */}
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-gray-900">My Listings</h1>
						<p className="mt-2 text-lg text-gray-600">Manage your posted tasks and review applications</p>
					</div>

					{/* Tasks Sections */}
					<div className="space-y-8">
						{/* Unassigned Tasks */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-2xl font-semibold text-gray-900 mb-4">Unassigned Tasks</h2>
							{unassignedTasks.length > 0 ? (
								<TaskSection
									title=""
									tasks={unassignedTasks}
									setTasks={setUnassignedTasks}
								/>
							) : (
								<p className="text-gray-500 italic">No unassigned tasks</p>
							)}
						</div>

						{/* In Progress Tasks */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-2xl font-semibold text-gray-900 mb-4">In Progress</h2>
							{inProgressTasks.length > 0 ? (
								<TaskSection
									title=""
									tasks={inProgressTasks}
									setTasks={setInProgressTasks}
								/>
							) : (
								<p className="text-gray-500 italic">No tasks in progress</p>
							)}
						</div>

						{/* Past Tasks */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-2xl font-semibold text-gray-900 mb-4">Completed Tasks</h2>
							{pastTasks.length > 0 ? (
								<TaskSection
									title=""
									tasks={pastTasks}
									setTasks={setPastTasks}
								/>
							) : (
								<p className="text-gray-500 italic">No completed tasks</p>
							)}
						</div>

						{/* Applications Section */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-2xl font-semibold text-gray-900 mb-4">Task Applications</h2>
							{Object.keys(applicationsByTask).length > 0 ? (
								<div className="space-y-6">
									{Object.entries(applicationsByTask).map(([taskId, applications]) => (
										<TaskApplicationsSection
											key={taskId}
											taskId={Number(taskId)}
											applications={applications}
											taskTitle={taskTitles[Number(taskId)] || `Task ${taskId}`}
										/>
									))}
								</div>
							) : (
								<p className="text-gray-500 italic">No applications received yet</p>
							)}
						</div>
					</div>
				</div>
			</Layout>
		</div>
	);
}
