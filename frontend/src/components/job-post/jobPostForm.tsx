'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { TaskCreate } from '@/types/task';
import { createTask } from '@/lib/api/tasks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';

const JobPostForm = () => {
	const formSchema = z.object({
		title: z.string().min(1, 'Title is required'),
		description: z.string().min(1, 'Description is required'),
		price: z.coerce.number({
			required_error: 'Price is required',
			invalid_type_error: 'Price must be a number',
		}),
		status: z.enum(['unassigned', 'in-progress', 'completed']),
		duration: z.string().min(1, 'Duration is required'),
		avatar: z.string().optional(),
		category: z.string().optional(),
		user_id: z.number(),
		location_id: z.number(),
	});

	const form = useForm<TaskCreate>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			price: 0,
			status: 'unassigned',
			duration: '',
			avatar: '', // Add avatar URL if available
			category: '', // Add category if available
			user_id: 1, // Replace with actual user ID
			location_id: 1, // Replace with actual location ID
		},
	});

	const onSubmit = async (data: TaskCreate) => {
		try {
			const payload = {
				title: data.title,
				description: data.description,
				price: data.price,
				status: 'unassigned',
				duration: data.duration,
				avatar: '', // Add avatar URL if available
				category: data.category,
				user_id: 1, // Replace with actual user ID
				location_id: 1, // Replace with actual location ID
			};
			const response = await createTask(data);
			console.log('Task created successfully:', response);
			alert('Task created successfully!');
		} catch (error) {
			console.error('Error creating task:', error);
			alert('Error creating task. Please try again.');
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Job Title</FormLabel>
							<FormControl>
								<Input
									className="border-0 border-b"
									placeholder="e.g. Help Move a Couch"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<FormControl>
								<Input
									className="border-0 border-b"
									placeholder="e.g. Labor"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Describe the task..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Rate</FormLabel>
							<FormControl>
								<Input
									className="border-0 border-b"
									placeholder="$20/hr or flat rate"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="duration"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Estimated Time</FormLabel>
							<FormControl>
								<Input
									className="border-0 border-b"
									placeholder="e.g. 2 hours"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="location_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Location</FormLabel>
							<FormControl>
								<Input
									className="border-0 border-b"
									placeholder="e.g. 123 Main St, San Diego, CA"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Post Job</Button>
			</form>
		</Form>
	);
};

export default JobPostForm;
