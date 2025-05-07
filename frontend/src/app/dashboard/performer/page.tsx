'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/layout';
import SuggestionsBar from '@/components/tasks/suggestionsBar';
import SearchBar from '@/components/tasks/taskSearchBar';
import TaskSuggestions from '@/components/tasks/taskSuggestions';
import { fetchTasks, updateTaskStatus } from '@/lib/api/tasks';
import { TaskType } from '@/types/task';

const categories = [
    'None',
    'Caregiving',
    'Creative & DIY',
    'Education',
    'Errands',
    'Home & Garden',
    'Labor',
    'Pet Care',
    'Repairs',
    'Transport',
];

const PerformerDashboardPage = () => {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [pastTasks, setPastTasks] = useState<TaskType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTasks(selectedCategory || undefined);
                setTasks(data.filter((task) => task.status !== 'completed'));
                setPastTasks(data.filter((task) => task.status === 'completed'));
            } catch (err) {
                setError('Failed to load tasks');
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [selectedCategory]);

    const handleStatusChange = async (taskId: number, newStatus: "completed" | "unassigned" | "in-progress") => {
        try {
            await updateTaskStatus(taskId, newStatus);
            setTasks((prevTasks) =>
                prevTasks.filter((task) => {
                    if (task.id === taskId) {
                        task.status = newStatus;
                    }
                    return newStatus !== 'completed';
                })
            );
            if (newStatus === 'completed') {
                const completedTask = tasks.find((task) => task.id === taskId);
                if (completedTask) {
                    setPastTasks((prevPastTasks) => [...prevPastTasks, completedTask]);
                }
            }
        } catch (err) {
            alert('Failed to update task status.');
        }
    };

    return (
        <Layout>
            <div className="flex min-h-screen mt-4">
                <SuggestionsBar
                    categories={categories}
                    onCategorySelect={(category) => setSelectedCategory(category)}
                />

                <main className="flex-1 p-6 space-y-6">
                    <SearchBar />
                    {loading && <p>Loading tasks...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <>
                            <TaskSuggestions tasks={tasks} onStatusChange={handleStatusChange} />
                            <section className="mt-12">
                                <h2 className="text-2xl font-bold mb-6">Past Tasks</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pastTasks.map((task) => (
                                        <div key={task.id} className="border rounded p-4">
                                            <h3 className="font-semibold">{task.title}</h3>
                                            <p className="text-gray-600">{task.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </main>
            </div>
        </Layout>
    );
};

export default PerformerDashboardPage;