'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/layout';
import PosterTaskCard from '@/components/tasks/posterTaskCard';
import { TaskType } from '@/types/task';
import { fetchPosterTasks, deleteTask } from '@/lib/api/tasks';
import { fetchApplicationsForTask } from '@/lib/api/applications';

export default function PosterDashboardPage() {
    const [unassignedTasks, setUnassignedTasks] = useState<TaskType[]>([]);
    const [inProgressTasks, setInProgressTasks] = useState<TaskType[]>([]);
    const [pastTasks, setPastTasks] = useState<TaskType[]>([]);
    const [applicationsByTask, setApplicationsByTask] = useState<{ [taskId: number]: any[] }>({}); // Storing applications by taskId

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const myTasks = await fetchPosterTasks();
                setUnassignedTasks(myTasks.filter((t) => t.status === 'unassigned'));
                setInProgressTasks(myTasks.filter((t) => t.status === 'in-progress'));
                setPastTasks(myTasks.filter((t) => t.status === 'completed'));

                // After tasks are loaded, load applications for each task
                myTasks.forEach((task) => {
                    loadApplications(task.id); // Call the function for each task's ID
                });
            } catch (err) {
                console.error('Failed to load poster tasks:', err);
            }
        };

        const loadApplications = async (taskId: number) => {
            try {
                console.log('Getting token');
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const apps = await fetchApplicationsForTask(taskId, token);
                console.log('Applications for Task:', apps); // Log applications for debugging

                // Update the applications state for each task
                setApplicationsByTask((prevState) => ({
                    ...prevState,
                    [taskId]: apps, // Store applications by taskId
                }));
            } catch (err) {
                console.error('Failed to load applications for task:', err);
            }
        };

        loadTasks();
    }, []);

    const handleDelete = async (taskId: number) => {
        try {
            await deleteTask(taskId); // Call the API function

            // Update the state to remove the task
            setUnassignedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
            setInProgressTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
            setPastTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

            console.log(`Task ${taskId} deleted successfully`);
        } catch (err) {
            console.error(`Failed to delete task ${taskId}:`, err);
        }
    };

    const handleEdit = (taskId: number) => {
        console.log(`Edit task ${taskId}`);
        // Redirect to an edit page or open a modal for editing
        window.location.href = `/tasks/edit/${taskId}`;
    };

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center text-black mb-8">
                <h1 className="text-3xl font-semibold mt-8 mb-4">My Listings</h1>

                {/* Unassigned Tasks */}
                <div className="w-full">
                    <h2 className="text-2xl font-bold mb-4">Unassigned</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unassignedTasks.map((task) => (
                            <PosterTaskCard
                                key={task.id}
                                task={task}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>

                {/* In Progress Tasks */}
                <div className="w-full">
                    <h2 className="text-2xl font-bold mb-4">In Progress</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inProgressTasks.map((task) => (
                            <PosterTaskCard
                                key={task.id}
                                task={task}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>

                {/* Completed Tasks */}
                <div className="w-full mt-8">
                    <h2 className="text-2xl font-bold mb-4">Completed</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pastTasks.map((task) => (
                            <PosterTaskCard
                                key={task.id}
                                task={task}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
