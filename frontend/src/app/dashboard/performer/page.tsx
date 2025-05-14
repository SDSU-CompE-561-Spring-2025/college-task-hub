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
				<div className="flex min-h-screen mt-4">
					<SuggestionsBar
						categories={categories}
						onCategorySelect={(category) => setSelectedCategory(category)}
					/>

					<main className="flex-1 p-6 space-y-6">
						<SearchBar />
						{loading && <p>Loading tasks...</p>}
						{error && <p className="text-red-500">{error}</p>}
						{/* Only render TaskSuggestions if userId is not null */}
						{!loading && !error && userId !== null && (
							<TaskSuggestions
								tasks={tasks}
								loggedInUserId={userId}
							/>
						)}
					</main>
				</div>
			</Layout>
		</ProtectedRoute>
	);
};

export default PerformerDashboardPage;
