'use client';

import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import TaskCard from './taskCard';
import { TaskType } from '@/types/task';

interface TaskSectionProps {
    title: string;
    tasks: TaskType[];
    setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
    onStatusChange: (taskId: number, newStatus: 'unassigned' | 'in-progress' | 'completed') => void;
}

const TaskSection: React.FC<TaskSectionProps> = ({ title, tasks, setTasks, onStatusChange }) => {
    return (
        <div className="w-6/10 my-4">
            <h1 className="font-semibold mb-4">{title}</h1>
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-12 pb-2">
                    {tasks.map((task) => (
                        <div key={task.id} className="flex flex-col items-center">
                            <TaskCard
                                taskName={task.title}
                                section={task.title}
                                profilePicUrl={task.avatar}
                                description={task.description}
                            />
                            {/* Dropdown for status change */}
                            <select
                                value={task.status}
                                onChange={(e) => onStatusChange(task.id, e.target.value as 'unassigned' | 'in-progress' | 'completed')}
                                className="mt-2 border rounded px-2 py-1"
                            >
                                <option value="unassigned">Unassigned</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
};

export default TaskSection;