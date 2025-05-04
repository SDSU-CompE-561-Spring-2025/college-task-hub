'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaskCreate } from '@/types/task';

type TaskCardProps = {
	onCreate: (task: TaskCreate) => void;
	onCancel: () => void;
	initialData?: TaskCreate;
};

type TaskFormData = {
	title: string;
	description: string;
	status?: string;
	price: string;
	user_id: string;
	location_id: string;
};

const TaskCard: React.FC<TaskCardProps> = ({ onCreate, onCancel, initialData }) => {
	const [formData, setFormData] = React.useState<TaskFormData>({
		title: initialData?.title || '',
		description: initialData?.description || '',
		status: initialData?.status || '',
		price: initialData?.price.toString() || '',
		user_id: initialData?.user_id.toString() || '',
		location_id: initialData?.location_id.toString() || '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleSubmit = () => {
		onCreate({
			title: formData.title,
			description: formData.description,
			status: formData.status || undefined,
			price: Number(formData.price),
			user_id: Number(formData.user_id),
			location_id: Number(formData.location_id),
		});
	};

	return (
		<div className="flex flex-col gap-6">
			<h2 className="text-2xl font-bold mb-2">{initialData ? 'Edit Task' : 'Create Task'}</h2>
			<div className="grid w-full gap-4">
				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="title">Title</Label>
					<Input
						id="title"
						value={formData.title}
						onChange={handleChange}
					/>
				</div>

				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="description">Description</Label>
					<textarea
						id="description"
						value={formData.description}
						onChange={handleChange}
						rows={4}
						className="border rounded-md px-3 py-2 text-sm"
					/>
				</div>

				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="price">Price</Label>
					<Input
						id="price"
						type="number"
						value={formData.price}
						onChange={handleChange}
					/>
				</div>

				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="status">Status (optional)</Label>
					<Input
						id="status"
						value={formData.status}
						onChange={handleChange}
					/>
				</div>

				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="user_id">User ID</Label>
					<Input
						id="user_id"
						type="number"
						value={formData.user_id}
						onChange={handleChange}
					/>
				</div>

				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="location_id">Location ID</Label>
					<Input
						id="location_id"
						type="number"
						value={formData.location_id}
						onChange={handleChange}
					/>
				</div>
			</div>

			<div className="flex justify-between mt-4">
				<Button
					variant="outline"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button onClick={handleSubmit}>{initialData ? 'Save Changes' : 'Create'}</Button>
			</div>
		</div>
	);
};

export default TaskCard;
