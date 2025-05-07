'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/layout';
import TaskSection from '@/components/tasks/taskSection';
import { TaskType } from '@/types/task';
import { fetchPosterTasks, updateTaskStatus } from '@/lib/api/tasks';

export default function PosterDashboardPage() {
    const [unassignedTasks, setUnassignedTasks] = useState<TaskType[]>([]);
    const [inProgressTasks, setInProgressTasks] = useState<TaskType[]>([]);
    const [pastTasks, setPastTasks] = useState<TaskType[]>([]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const myTasks = await fetchPosterTasks();
                setUnassignedTasks(myTasks.filter((t) => t.status === 'unassigned'));
                setInProgressTasks(myTasks.filter((t) => t.status === 'in-progress'));
                setPastTasks(myTasks.filter((t) => t.status === 'completed'));
            } catch (err) {
                console.error('Failed to load poster tasks:', err);
            }
        };

        loadTasks();
    }, []);

    const handleStatusChange = async (taskId: number, newStatus: 'unassigned' | 'in-progress' | 'completed') => {
        try {
            await updateTaskStatus(taskId, newStatus);

            // Find the task in any of the current sections
        const task =
            unassignedTasks.find((t) => t.id === taskId) ||
            inProgressTasks.find((t) => t.id === taskId) ||
            pastTasks.find((t) => t.id === taskId);

        if (!task) {
            console.error('Task not found in any section.');
            return;
        }

        // Remove the task from all sections
        setUnassignedTasks((prev) => prev.filter((t) => t.id !== taskId));
        setInProgressTasks((prev) => prev.filter((t) => t.id !== taskId));
        setPastTasks((prev) => prev.filter((t) => t.id !== taskId));

        // Add the task to the appropriate section based on the new status
        if (newStatus === 'unassigned') {
            setUnassignedTasks((prev) => [...prev, { ...task, status: newStatus }]);
        } else if (newStatus === 'in-progress') {
            setInProgressTasks((prev) => [...prev, { ...task, status: newStatus }]);
        } else if (newStatus === 'completed') {
            setPastTasks((prev) => [...prev, { ...task, status: newStatus }]);
        }
    } catch (err) {
        alert('Failed to update task status.');
    }
};

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center text-black mb-8">
                <h1 className="text-3xl font-semibold mt-8 mb-4">My Listings</h1>

                {/* Unassigned Tasks */}
                <TaskSection
                    title="Unassigned"
                    tasks={unassignedTasks}
					setTasks={setUnassignedTasks}
                    onStatusChange={handleStatusChange}
                />

                {/* In Progress Tasks */}
                <TaskSection
                    title="In Progress"
                    tasks={inProgressTasks}
					setTasks={setInProgressTasks}
                    onStatusChange={handleStatusChange}
                />

                {/* Completed Tasks */}
                <TaskSection
                    title="Completed"
                    tasks={pastTasks}
					setTasks={setPastTasks}
                    onStatusChange={handleStatusChange}
                />
            </div>
        </Layout>
    );
}