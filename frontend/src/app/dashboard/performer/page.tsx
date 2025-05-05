'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/layout';
import SuggestionsBar from '@/components/tasks/suggestionsBar';
import SearchBar from '@/components/tasks/taskSearchBar';
import TaskSuggestions from '@/components/tasks/taskSuggestions';
import { fetchTasks } from '@/lib/api/tasks';
import { TaskType } from '@/types/task';

const categories = [
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

	useEffect(() => {
		const loadTasks = async () => {
			try {
				const data = await fetchTasks(selectedCategory || undefined);
				setTasks(data);
			} catch (err) {
				setError('Failed to load tasks');
			} finally {
				setLoading(false);
			}
		};

		loadTasks();
	}, [selectedCategory]);

	return (
		<Layout>
			<div className="flex min-h-screen mt-4">
				<SuggestionsBar categories={categories} />

				<main className="flex-1 p-6 space-y-6">
					<SearchBar />
					{loading && <p>Loading tasks...</p>}
					{error && <p className="text-red-500">{error}</p>}
					{!loading && !error && <TaskSuggestions tasks={tasks} />}
				</main>
			</div>
		</Layout>
	);
};

export default PerformerDashboardPage;
