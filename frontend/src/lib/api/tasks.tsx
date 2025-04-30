import axios from 'axios';
import { TaskType, TaskCreate } from '@/types/task';

// Fetch Tasks component
export const fetchTasks = async (): Promise<TaskType[]> => {
	const response = await axios.get('http://localhost:8000/api/task');
	if (response.status !== 200) {
		throw new Error('Failed to fetch tasks');
	}
	return response.data;
};

// Fetch Task by ID component
export const fetchTaskById = async (id: number): Promise<TaskType> => {
	const response = await axios.get(`http://localhost:8000/api/task/${id}`);
	if (response.status !== 200) {
		throw new Error('Failed to fetch task');
	}
	return response.data;
};

// Create Task component
export const createTask = async (task: TaskCreate): Promise<TaskType> => {
	const response = await axios.post('http://localhost:8000/api/task', task);
	if (response.status !== 200) {
		throw new Error('Failed to create task');
	}
	return response.data;
};

// Update Task Componet
export const updateTask = async (id: number, task: TaskCreate): Promise<TaskType> => {
	const response = await axios.put(`http://localhost:8000/api/task/${id}`, task);
	if (response.status !== 200) {
		throw new Error('Failed to update task');
	}
	return response.data;
};

// Delete Task component
export const deleteTask = async (id: number): Promise<void> => {
	const response = await axios.delete(`http://localhost:8000/api/task/${id}`);
	if (response.status !== 200) {
		throw new Error('Failed to delete task');
	}
};
