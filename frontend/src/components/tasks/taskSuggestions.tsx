import React from 'react';
import PerformerTaskCard from '@/components/tasks/performerTaskCard';

type Task = {
    title: string;
    duration: string;
    rate: string;
    avatar: string;
};

type TaskSuggestionsProps = {
    tasks: Record<string, Task[]>;
};

const TaskSuggestions: React.FC<TaskSuggestionsProps> = ({ tasks }) => {
    return (
        <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Task Suggestions</h2>
            {Object.entries(tasks).map(([category, items]) => (
                <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {items.map((task, index) => (
                            <PerformerTaskCard key={index} task={task}/>
                          ))}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default TaskSuggestions;
