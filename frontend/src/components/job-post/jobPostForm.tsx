'use client';

import React, { useEffect, useState } from 'react';
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
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { createLocation, fetchLocations } from '@/lib/api/locations';

const locationSchema = z.object({
	street: z.string().min(1, 'Street is required'),
	city: z.string().min(1, 'City is required'),
	state: z.string().min(1, 'State is required'),
	zipcode: z.coerce.number({
		required_error: 'ZIP code is required',
		invalid_type_error: 'ZIP code must be a number',
	}),
});

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
	location_id: z.number().optional(),
	new_location: z.optional(locationSchema),
});

type FormValues = z.infer<typeof formSchema>;

export default function JobPostForm() {
	const [locations, setLocations] = useState<{ id: number; label: string }[]>([]);
	const [adding, setAdding] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			price: 0,
			status: 'unassigned',
			duration: '',
			avatar: '',
			category: '',
			user_id: 1,
			location_id: undefined,
			new_location: undefined,
		},
	});

	const selectedLoc = useWatch({
		control: form.control,
		name: 'location_id',
	});

	useEffect(() => {
		const load = async () => {
			try {
				const data = await fetchLocations();
				setLocations(
					data.map((loc) => ({
						id: loc.id,
						label: `${loc.street}, ${loc.city}`,
					}))
				);
			} catch (e) {
				console.error('Error fetching locations:', e);
			}
		};
		load();
	}, []);

	const onSubmit = async (data: FormValues) => {
		try {
			let locationId = data.location_id;

			if (adding && data.new_location) {
				const newLocation = await createLocation(data.new_location);
				locationId = newLocation.id;
			}
			const payload: any = {
				title: data.title,
				description: data.description,
				price: data.price,
				status: data.status,
				duration: data.duration,
				avatar: data.avatar,
				category: data.category,
				user_id: data.user_id,
				location_id: locationId,
			};
			if (adding && data.new_location) {
				payload.new_location = data.new_location;
			} else if (data.location_id) {
				payload.location_id = data.location_id;
			}
			const response = await createTask(payload);
			console.log('Task created successfully:', response);
			alert('Task created successfully!');
			form.reset();
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
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger className="border-0 border-b">
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Caregiving">Caregiving</SelectItem>
									<SelectItem value="Creative & DIY">Creative & DIY</SelectItem>
									<SelectItem value="Education">Education</SelectItem>
									<SelectItem value="Errands">Errands</SelectItem>
									<SelectItem value="Home & Garden">Home & Garden</SelectItem>
									<SelectItem value="Labor">Labor</SelectItem>
									<SelectItem value="Pet Care">Pet Care</SelectItem>
									<SelectItem value="Repairs">Repairs</SelectItem>
									<SelectItem value="Transport">Transport</SelectItem>
									<SelectItem value="None">None</SelectItem>
								</SelectContent>
							</Select>
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
									type="number"
									step="0.01"
									min="0"
									className="border-0 border-b"
									placeholder="20.00"
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
							{locations.length > 0 && (
								<div className="mb-4 space-y-1 text-sm text-gray-700">
									<p className="font-medium">Saved Locations:</p>
									{locations.map((loc) => (
										<button
											type="button"
											key={loc.id}
											onClick={() => {
												setAdding(false);
												form.setValue('location_id', loc.id);
											}}
											className={`flex items-center gap-1 text-left w-full px-2 py-1 rounded-md hover:bg-sky-100 ${
												selectedLoc === loc.id ? 'bg-sky-200 font-semibold' : ''
											}`}
										>
											<span
												role="img"
												aria-label="pin"
											>
												📍
											</span>{' '}
											{loc.label}
										</button>
									))}
								</div>
							)}

							<Select
								value={adding ? 'add_new' : (field.value?.toString() ?? '')}
								onValueChange={(val) => {
									if (val === 'add_new') {
										setAdding(true);
										form.setValue('location_id', undefined);
									} else {
										setAdding(false);
										form.setValue('location_id', Number(val));
									}
								}}
							>
								<FormControl>
									<SelectTrigger className="border-0 border-b w-64">
										<SelectValue placeholder="Select a location or add new" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{locations.map((loc) => (
										<SelectItem
											key={loc.id}
											value={loc.id.toString()}
										>
											{loc.label}
										</SelectItem>
									))}
									<SelectItem value="add_new">+ Add New Location</SelectItem>
								</SelectContent>
							</Select>

							{adding && (
								<div className="mt-4 grid grid-cols-1 gap-4 w-64">
									<Input
										placeholder="Street"
										{...form.register('new_location.street')}
									/>
									<Input
										placeholder="City"
										{...form.register('new_location.city')}
									/>
									<Input
										placeholder="State"
										{...form.register('new_location.state')}
									/>
									<Input
										placeholder="ZIP"
										{...form.register('new_location.zipcode')}
									/>
								</div>
							)}

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Post Job</Button>
			</form>
		</Form>
	);
}
