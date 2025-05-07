'use client';

import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Application {
	id: number;
	created_at: string;
	performer: {
		name: string;
		avatar_url?: string;
	};
	message?: string;
}

interface TaskApplicationsSectionProps {
	taskId: number;
    taskTitle: string;
	applications: Application[];
}

const TaskApplicationsSection: React.FC<TaskApplicationsSectionProps> = ({ taskId, applications }) => {
	return (
		<div className="w-6/10 my-4">
			<h2 className="font-semibold text-lg mb-4">Task {taskId}</h2>
			<ScrollArea className="w-full whitespace-nowrap">
				<div className="flex gap-4 pb-2">
					{applications.map((application) => (
						<div
							key={application.id}
							className="min-w-[250px] bg-white rounded-xl shadow p-4 border"
						>
							<div className="flex items-center justify-between mb-2">
								<div>
									<p className="font-medium">{application.performer?.name || 'Anonymous'}</p>
									<p className="text-xs text-gray-500">
										{new Date(application.created_at).toLocaleDateString()}
									</p>
								</div>
								{/* Optional performer avatar */}
								{application.performer?.avatar_url && (
									<img
										src={application.performer.avatar_url}
										alt="Avatar"
										className="w-8 h-8 rounded-full"
									/>
								)}
							</div>
							<p className="text-sm text-gray-700">
								{application.message || 'No message provided.'}
							</p>
							{/* Optional actions */}
							<button
								className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
								onClick={() => console.log('Assign app id:', application.id)}
							>
								Assign
							</button>
						</div>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
};

export default TaskApplicationsSection;
