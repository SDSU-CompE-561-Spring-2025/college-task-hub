'use client';

import React from 'react';
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
}

const PerformerTaskCard: React.FC<TaskCardProps> = ({ task }) => {
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
			</DialogContent>
		</Dialog>
	);
};

export default PerformerTaskCard;
