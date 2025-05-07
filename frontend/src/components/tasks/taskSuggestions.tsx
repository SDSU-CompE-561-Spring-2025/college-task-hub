import React from 'react';
import PerformerTaskCard from '@/components/tasks/performerTaskCard';
import { TaskCreate, TaskType } from '@/types/task';



type TaskSuggestionsProps = {
    tasks: TaskType[];
    onStatusChange: (taskId: number, newStatus: "completed" | "unassigned" | "in-progress") => void;
};

const TaskSuggestions: React.FC<TaskSuggestionsProps> = ({ tasks, onStatusChange }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
                <div key={task.id} className="border rounded p-4">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-gray-600">{task.description}</p>
                    <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value as "completed" | "unassigned" | "in-progress")}
                        className="mt-2 border rounded px-2 py-1"
                    >
                        <option value="unassigned">Unassigned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            ))}
        </div>
    );
};

export default TaskSuggestions;
