'use client';

import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { User } from 'lucide-react';

interface Application {
	id: number;
	created_at: string;
	performer: {
		id: number;
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

const TaskApplicationsSection: React.FC<TaskApplicationsSectionProps> = ({ taskId, taskTitle, applications }) => {
	return (
		<div className="w-full my-4">
			<h2 className="text-xl font-semibold text-gray-900 mb-4">{taskTitle}</h2>
			<ScrollArea className="w-full whitespace-nowrap">
				<div className="flex gap-4 pb-2">
					{applications.map((application) => (
						<div
							key={application.id}
							className="min-w-[300px] bg-white rounded-xl shadow p-4 border"
						>
							<div className="flex items-center justify-between mb-3">
								<Link 
									href={`/profile/${application.performer.id}`}
									className="flex items-center gap-2 hover:underline"
								>
									{application.performer.avatar_url ? (
										<img
											src={application.performer.avatar_url}
											alt={`${application.performer.name}'s avatar`}
											className="w-10 h-10 rounded-full object-cover"
										/>
									) : (
										<div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
											<User className="w-6 h-6 text-gray-400" />
										</div>
									)}
									<div>
										<p className="font-medium text-gray-900">{application.performer.name}</p>
										<p className="text-xs text-gray-500">
											Applied {new Date(application.created_at).toLocaleDateString()}
										</p>
									</div>
								</Link>
							</div>
							
							{application.message && (
								<div className="mt-2 p-3 bg-gray-50 rounded-lg">
									<p className="text-sm text-gray-700">{application.message}</p>
								</div>
							)}
							
							<div className="mt-4 flex justify-end gap-2">
								<button
									className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm transition-colors"
									onClick={() => console.log('Assign app id:', application.id)}
								>
									Assign Task
								</button>
							</div>
						</div>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
};

export default TaskApplicationsSection;
