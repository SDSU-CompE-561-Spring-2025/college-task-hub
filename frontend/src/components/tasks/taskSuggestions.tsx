import React from 'react';
import PerformerTaskCard from '@/components/tasks/performerTaskCard';
import { TaskCreate, TaskType } from '@/types/task';

type TaskSuggestionsProps = {
	tasks: TaskType[];
};

const TaskSuggestions: React.FC<TaskSuggestionsProps> = ({ tasks }) => {
	return (
		<section className="mt-12">
			<h2 className="text-2xl font-bold mb-6">Task Suggestions</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{tasks.map((task) => (
					<PerformerTaskCard
						key={task.id}
						task={task}
					/>
				))}
			</div>
		</section>
	);
};

export default TaskSuggestions;
