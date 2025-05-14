import React from 'react';
import { TaskType } from '@/types/task';

interface PosterTaskCardProps {
    task: TaskType;
    onEdit: (taskId: number) => void;
    onDelete: (taskId: number) => void;
}

const PosterTaskCard: React.FC<PosterTaskCardProps> = ({ task, onEdit, onDelete }) => {
    return (
        <div className="border rounded-lg shadow-md p-4 bg-white">
            {/* Task Title */}
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>

            {/* Task Description */}
            <p className="text-sm text-gray-600 mt-2">{task.description}</p>

            {/* Task Details */}
            <div className="mt-4">
                <p className="text-sm text-gray-800">
                    <strong>Price:</strong> ${task.price}
                </p>
                <p className="text-sm text-gray-800">
                    <strong>Duration:</strong> {task.duration}
                </p>
                <p className="text-sm text-gray-800">
                    <strong>Status:</strong> {task.status}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => onEdit(task.id)}
                >
                    Edit
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => onDelete(task.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default PosterTaskCard;