'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/layout';
import SuggestionsBar from '@/components/tasks/suggestionsBar';
import SearchBar from '@/components/tasks/taskSearchBar';
import TaskSuggestions from '@/components/tasks/taskSuggestions';
import { fetchTasks } from '@/lib/api/tasks';
import { TaskType } from '@/types/task';
import axios from 'axios';
import ProtectedRoute from '@/components/auth/protectedRoute';

const categories = [
	'None',
	'Caregiving',
	'Creative & DIY',
	'Education',
	'Errands',
	'Home & Garden',
	'Labor',
	'Pet Care',
	'Repairs',
	'Transport',
];

const PerformerDashboardPage = () => {
	const [tasks, setTasks] = useState<TaskType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [userId, setUserId] = useState<number | null>(null);

	useEffect(() => {
		const fetchUserAndTasks = async () => {
			try {
				// Fetch user data
				const token = localStorage.getItem('access_token');
				const response = await axios.get('http://localhost:8000/api/user/me', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setUserId(response.data.id); // Store userId

				// Fetch tasks
				const data = await fetchTasks(selectedCategory || undefined);
				setTasks(data);
			} catch (err) {
				setError('Failed to load tasks');
			} finally {
				setLoading(false);
			}
		};

		fetchUserAndTasks();
	}, [selectedCategory]);

	return (
		<ProtectedRoute role="performer">
			<Layout>
				<div className="min-h-screen bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						{/* Header Section */}
						<div className="mb-8">
							<h1 className="text-4xl font-bold text-gray-900">Find Tasks</h1>
							<p className="mt-2 text-lg text-gray-600">Browse and apply for tasks that match your skills</p>
						</div>

						<div className="flex flex-col lg:flex-row gap-8">
							{/* Sidebar */}
							<div className="lg:w-64 flex-shrink-0">
								<div className="bg-white rounded-lg shadow-sm p-6">
									<h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
									<SuggestionsBar
										categories={categories}
										onCategorySelect={(category) => setSelectedCategory(category)}
									/>
								</div>
							</div>

							{/* Main Content */}
							<main className="flex-1">
								<div className="bg-white rounded-lg shadow-sm p-6">
									{/* Search Bar */}
									<div className="mb-6">
										<SearchBar />
									</div>

									{/* Loading State */}
									{loading && (
										<div className="flex items-center justify-center py-12">
											<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
										</div>
									)}

									{/* Error State */}
									{error && (
										<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
											<p className="text-red-600">{error}</p>
										</div>
									)}

									{/* Task List */}
									{!loading && !error && userId !== null && (
										<div className="space-y-6">
											<TaskSuggestions
												tasks={tasks}
												loggedInUserId={userId}
											/>
										</div>
									)}

									{/* Empty State */}
									{!loading && !error && tasks.length === 0 && (
										<div className="text-center py-12">
											<p className="text-gray-500 text-lg">No tasks found matching your criteria</p>
										</div>
									)}
								</div>
							</main>
						</div>
					</div>
				</div>
			</Layout>
		</ProtectedRoute>
	);
};

export default PerformerDashboardPage;
