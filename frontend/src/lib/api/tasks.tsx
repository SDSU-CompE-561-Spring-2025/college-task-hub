import axios from 'axios';
import { TaskType, TaskCreate } from '@/types/task';

// Fetch Tasks component
export const fetchTasks = async (category?: string): Promise<TaskType[]> => {
	const token = localStorage.getItem('access_token');
	const url = new URL(`http://localhost:8000/api/task`);
	if (category) {
		url.searchParams.append('category', category);
	}

	const response = await axios.get(url.toString(), {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (response.status !== 200) {
		throw new Error('Failed to fetch tasks');
	}
	return response.data;
};

// Create Task component
export const createTask = async (task: TaskCreate): Promise<TaskType> => {
	const token = localStorage.getItem('access_token');
	const response = await axios.post('http://localhost:8000/api/task', task, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (response.status !== 200) {
		throw new Error('Failed to create task');
	}
	return response.data;
};

// Update Task Componet
export const updateTaskStatus = async (taskId: number, status: string): Promise<TaskType> => {
    const token = localStorage.getItem('access_token');
    const response = await axios.put(
        `http://localhost:8000/api/task/${taskId}/status`,
        { status },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (response.status !== 200) {
        throw new Error('Failed to update task status');
    }
    return response.data;
};
// Delete Task component
export const deleteTask = async (id: number): Promise<void> => {
	const token = localStorage.getItem('access_token');
	const response = await axios.delete(`http://localhost:8000/api/task/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (response.status !== 200) {
		throw new Error('Failed to delete task');
	}
};

// Fetch all tasks for the current poster
export const fetchPosterTasks = async (): Promise<TaskType[]> => {
	const token = localStorage.getItem('access_token');
	const response = await axios.get('http://localhost:8000/api/task/mine', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (response.status !== 200) {
		throw new Error('Failed to fetch user’s tasks');
	}
	return response.data;
};
