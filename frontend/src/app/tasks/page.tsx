'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/layout';
import TaskCard from '@/components/tasks/taskCardDeprecated';

type Task = {
  id: number;
  title: string;
  category: string;
  location: string;
  rating: number;
};

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/jobs')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Filter tasks based on user input
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen text-black p-6 gap-6">
        <TaskCard 
          onCreate={() => console.log('Task created')} 
          onCancel={() => console.log('Task canceled')} 
        />

        <h1 className="text-3xl font-bold">Available Tasks</h1>

        <input
          type="text"
          placeholder="Search by task title..."
          aria-label="Search tasks by title"
          className="border px-4 py-2 rounded w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="underline text-blue-600 space-y-2 mt-4">
            {filteredTasks.length === 0 ? (
              <p className="text-gray-500">No tasks match your search. Try a different keyword.</p>
            ) : (
              filteredTasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="hover:text-blue-800 transition-colors"
                  >
                    {task.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </Layout>
  );
}