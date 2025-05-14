'use client';

import React, { useState } from 'react';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { TaskType } from '@/types/task';

interface TaskCardProps {
	task: TaskType;
	userId: number;
}

const PerformerTaskCard: React.FC<TaskCardProps> = ({ task, userId }) => {
	const [hasApplied, setHasApplied] = useState(task.hasApplied);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const apply = async () => {
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem('access_token');

			if (!token) {
				setError('You must be logged in to apply.');
				setLoading(false);
				return;
			}

			const res = await fetch('http://localhost:8000/api/application', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ task_id: task.id }),
			});

			if (res.ok || res.status === 409) {
				setHasApplied(true);
			} else {
				const message = await res.text();
				setError(`Failed to apply: ${message}`);
			}
		} catch (err) {
			setError('Error applying. Please try again later.');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Card className="cursor-pointer hover:shadow-lg transition">
					<CardContent className="px-4 py-2 space-y-6">
						<div className="flex items-center gap-2">
							<div className="text-xl">{task.avatar}</div>
							<div className="font-medium">{task.title}</div>
						</div>
						<div className="px-2 flex justify-between text-sm text-gray-600">
							<span>{task.description}</span>
							<span>${task.price}</span>
						</div>
					</CardContent>
				</Card>
			</DialogTrigger>
			<DialogContent className="rounded-lg">
				<DialogHeader>
					<DialogTitle>{task.title}</DialogTitle>
				</DialogHeader>

				<DialogDescription>
					{task.description || 'No additional description provided.'}
				</DialogDescription>

				<div className="flex justify-between text-sm mt-4">
					<span>Duration: {task.duration}</span>
					<span>Rate: {task.price}</span>
				</div>

				{/* Display error message if there is one */}
				{error && <div className="text-red-500 mt-4">{error}</div>}

				<div className="flex justify-end mt-6">
					{hasApplied ? (
						<button
							className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
							disabled
						>
							Application sent
						</button>
					) : (
						<button
							onClick={apply}
							disabled={loading}
							className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
						>
							{loading ? 'Applying…' : 'Apply'}
						</button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PerformerTaskCard;
