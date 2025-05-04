'use client';
import React, { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { TaskType, TaskCreate } from '@/types/task';
import TaskCard from '@/components/tasks/taskCard1';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/lib/api/tasks';

const PostTasks = () => {
	const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
	const [sortOrder, setSortOrder] = useState('low-to-high');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const queryClient = useQueryClient();

	const { data: tasks = [] } = useQuery({
		queryKey: ['tasks'],
		queryFn: fetchTasks,
	});

	const createMutation = useMutation({
		mutationFn: (task: TaskCreate) => createTask(task),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] }).then(() => {
				setSelectedTask(null);
				setIsDialogOpen(false);
				setIsEditing(false);
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: TaskCreate }) => updateTask(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] }).then(() => {
				setSelectedTask(null);
				setIsEditing(false);
				setIsDialogOpen(false);
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteTask(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] }).then(() => {
				setSelectedTask(null);
				setIsEditing(false);
				setIsDialogOpen(false);
			});
		},
	});

	const sortedTasks = [...tasks].sort((a, b) => {
		return sortOrder === 'low-to-high'
			? Number(a.price) - Number(b.price)
			: Number(b.price) - Number(a.price);
	});

	return (
		<div className="flex flex-col items-center justify-start min-h-screen py-10 px-4 text-black">
			<div className="w-full max-w-3xl">
				<div className="flex items-center justify-between mb-6">
					<div className="flex gap-4">
						{/* Sorting component */}
						<Select onValueChange={(value) => setSortOrder(value)}>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low-to-high">Price: Low to High</SelectItem>
								<SelectItem value="high-to-low">Price: High to Low</SelectItem>
							</SelectContent>
						</Select>
						{/* Button to create a task */}
						<Button
							onClick={() => {
								setSelectedTask(null); // clear any selected
								setIsDialogOpen(true);
							}}
						>
							Create New Task
						</Button>
					</div>
				</div>
				{/* Task cards display */}
				<div className="grid gap-4">
					{sortedTasks.map((task) => (
						<Card
							key={task.id}
							onClick={() => {
								setSelectedTask(task);
								setIsEditing(false); // <-- Not editing yet
								setIsDialogOpen(true);
							}}
							className="cursor-pointer hover:shadow-lg transition"
						>
							<CardHeader>
								<CardTitle className="text-lg">{task.title}</CardTitle>
								{/* Profile Picture */}
								<div className="flex items-center space-x-2">
									<img
										src="/next.svg"
										alt="Profile Picture"
										className="w-5 h-5 rounded-full border border-gray-300"
									/>
									<div className="flex items-center space-x-4 text-sm text-gray-500">
										<p> MyUserName12 </p>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p>{task.description}</p>
							</CardContent>
							<CardFooter className="relative flex items-center justify-between"></CardFooter>
						</Card>
					))}
				</div>
				{/* Dialog for Create and Edit */}
				<Dialog
					open={isDialogOpen}
					onOpenChange={(open) => {
						if (!open) {
							setSelectedTask(null);
							setIsEditing(false);
						}
						setIsDialogOpen(open);
					}}
				>
					<DialogContent className="w-screen max-w-none max-h-none">
						<DialogHeader>
							<DialogTitle>
								{isEditing ? 'Edit Task' : selectedTask ? 'Task Details' : 'Create Task'}
							</DialogTitle>
						</DialogHeader>
						{!isEditing && selectedTask ? (
							// Viewing Task Details
							<div className="flex flex-col gap-4">
								<h2 className="flex items-center justify-between text-2xl font-bold">
									{/* Title on the left */}
									<span>
										{selectedTask.title}
										<p className="flex text-sm text-gray-500"> Estimated Time: 60 minutes</p>
									</span>
									{/* Profile Picture and Info on the right */}
									<div className="flex items-center space-x-2">
										<img
											src="/next.svg"
											alt="Profile Picture"
											className="w-8 h-8 rounded-full border border-gray-300"
										/>
										<div className="flex flex-col text-sm text-gray-500">
											<p>Created By: MyUserName12</p>
											<p>Posted: 10/10/2025</p>
										</div>
									</div>
								</h2>
								<p>
									<strong>Description:</strong> {selectedTask.description}
								</p>
								<p>
									<strong>Price:</strong> {selectedTask.price}
								</p>
								<p>
									<strong>Location:</strong> {selectedTask.location_id}
								</p>
								<div className="flex gap-2 mt-4">
									<Button onClick={() => setIsEditing(true)}>Edit</Button>
									<Button
										variant="destructive"
										onClick={() => {
											if (selectedTask) {
												if (confirm('Are you sure you want to delete this task?')) {
													deleteMutation.mutate(selectedTask.id);
												}
											}
										}}
									>
										Delete
									</Button>
								</div>
							</div>
						) : (
							// Editing with TaskCard
							<TaskCard
								initialData={selectedTask || undefined}
								onCreate={(data) => {
									const formattedData = {
										...data,
										price: Number(data.price),
										user_id: Number(data.user_id),
										location_id: Number(data.location_id),
									};
									if (!selectedTask) {
										createMutation.mutate(formattedData);
									} else {
										updateMutation.mutate({ id: selectedTask.id, data: formattedData });
									}
								}}
								onCancel={() => {
									setSelectedTask(null);
									setIsEditing(false);
									setIsDialogOpen(false);
								}}
							/>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default PostTasks;
