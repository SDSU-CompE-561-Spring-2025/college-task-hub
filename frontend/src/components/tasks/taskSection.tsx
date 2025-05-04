'use client';

import React from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TaskCard from './taskCard';

interface TaskSectionProps {
    title: string;
    tasks: string[];
    setTasks: React.Dispatch<React.SetStateAction<string[]>>;
  }

const TaskSection: React.FC<TaskSectionProps> = ({ title, tasks, setTasks }) => {
  return (
    <div className="w-6/10 my-4">
      <h1 className="font-semibold">{title}</h1>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-12 pb-2">
            {tasks.map((task, index) => (
              <TaskCard
                key={index}
                taskName={task}
                section={title}
                profilePicUrl="https://example.com/image.jpg"
              />
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TaskSection;
