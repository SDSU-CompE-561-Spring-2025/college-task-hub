'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import ReviewCard from '@/components/profile/ReviewCard';
import ContactPopUp from '@/components/profile/ContactPopUp';
import LeaveReview from '@/components/profile/LeaveReview';
import { updateProfile } from '@/lib/api/updateProfile';

interface Review {
	reviewerName: string;
	reviewerProfilePicture: string;
	rating: number;
	comment: string;
	jobTitle: string;
}

interface ProfileCardProps {
	userId: number;
	loggedInUserId: number;
	username: string;
	profilePictureUrl: string;
	skills: string;
	rating: number;
	city: string;
	role: string;
	recentJobs?: { title: string; rating: number }[];
	reviews: Review[];
	email: string;
	phone_number: string;
	viewerRole: 'Task Performer' | 'Task Poster';
}

export default function ProfileCard({
	userId,
	loggedInUserId,
	username = 'No username provided',
	profilePictureUrl = 'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740',
	skills = 'No skills provided',
	rating = 0,
	city = 'No city provided',
	role = 'No role provided',
	viewerRole = 'Task Poster',
	recentJobs = [{ title: 'No recent jobs provided', rating: 0 }],
	reviews = [
		{
			reviewerName: 'No reviewer name provided',
			reviewerProfilePicture:
				'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fprofile&psig=AOvVaw2NaRv-4R192W1QLaV0Y3IQ&ust=1746311351883000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCIi0_e_qhY0DFQAAAAAdAAAAABAE',
			jobTitle: 'No job title provided',
			rating: 0,
			comment: 'No comment provided',
		},
	],
	email = 'No email provided',
	phone_number = 'No phone number provided',
}: ProfileCardProps) {
	console.log('Received userId:', userId);
	const [adjustedSkills, setUpdatedSkills] = useState('');
	const [adjustedEmail, setUpdatedEmail] = useState('');
	const [adjustedPhoneNumber, setUpdatedPhoneNumber] = useState('');
	const [adjustedCity, setUpdatedCity] = useState('');
	const [fetchedReviews, setFetchedReviews] = useState<Review[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [photoTimestamp, setPhotoTimestamp] = useState(Date.now());
	//Top skills are the first three skills in the list
	const allSkills = (adjustedSkills || '').split(',').map((skill) => skill.trim());
	const topSkills = allSkills.slice(0, 3);

	//State to hold the reviews fetched from the backend
	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/api/ratings/${userId}`);
				setFetchedReviews(res.data);
			} catch (err) {
				console.error('Error fetching reviews:', err);
			}
		};
		fetchReviews();
	}, [userId]);

	useEffect(() => {
		if (skills) setUpdatedSkills(skills);
		if (email) setUpdatedEmail(email);
		if (phone_number) setUpdatedPhoneNumber(phone_number);
		if (city) setUpdatedCity(city);
	}, [skills, email, phone_number, city]);

	//Used for overall rating in profile
	const averageRating =
		fetchedReviews.length > 0
			? fetchedReviews.reduce((sum, r) => sum + r.rating, 0) / fetchedReviews.length
			: 0;

	const Save = async () => {
		console.log('Updating user ID:', userId);
		try {
			const updatedData = {
				skills: adjustedSkills ?? skills,
				email: adjustedEmail ?? email,
				phone_number: adjustedPhoneNumber ?? phone_number,
				name: username,
				roles: role === 'Task Performer' ? 'performer' : 'poster',
				rating: rating ?? 0,
			};
			console.log('Sending profile update:', updatedData);
			await updateProfile(userId, updatedData);

			if (selectedFile) {
				const formData = new FormData();
				formData.append('file', selectedFile);
				await axios.post(
					`http://localhost:8000/api/upload-profile-pic/?user_id=${userId}`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				);
				setPhotoTimestamp(Date.now());
			}

			alert('Profile updated successfully!');
		} catch (error) {
			console.error('Failed to update profile:', error);
			alert('Failed to update profile.');
		}
	};
	console.log('userId being passed to LeaveReview:', userId);
	return (
		<div className="relative w-full max-w-4xl p-8 rounded-lg shadow-md mx-auto border-2 border-black">
			{/* Contact & review buttons only show for the task posters*/}
			<div className="absolute top-4 right-4 flex gap-4">
				{viewerRole === 'Task Poster' && (
					<ContactPopUp
						email={email}
						phone_number={phone_number}
					/>
				)}
				{viewerRole === 'Task Poster' && (
					<LeaveReview
						receiverId={userId}
						giverId={loggedInUserId}
						onReviewSubmit={(newReview) => setFetchedReviews((prev) => [...prev, newReview])}
					/>
				)}
			</div>

			{/* Profile info */}
			<div className="flex items-center mb-8 space-x-8">
				<img
					src={`http://localhost:8000/media/profile_images/${userId}.jpg?${photoTimestamp}`}
					onError={(e) => {
						// If image doesn't exist, use the default
						(e.target as HTMLImageElement).src =
							'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740';
					}}
					alt="Profile Picture"
					className="w-32 h-32 rounded-full object-cover"
				/>
				{viewerRole === 'Task Performer' && (
					<div className="mt-2">
						<label className="block text-sm font-medium text-gray-700">
							Change Profile Picture
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									setSelectedFile(file);
								}
							}}
							className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
						/>
					</div>
				)}
				<div>
					<h2 className="text-3xl font-bold text-black mb-1">{username}</h2>
				</div>
			</div>
			{/* Creating two sides */}
			<div className="flex gap-8 ">
				{/* Left side */}
				<div className="flex-1 flex flex-col space-y-6">
					{/* Skills & Rating */}
					<div className="space-y-4 ">
						<p className="text-lg font-semibold text-gray-700 mb-4">
							Rating:
							<span className="ml-2">
								{'⭐'.repeat(Math.ceil(averageRating))}
								{'☆'.repeat(5 - Math.ceil(averageRating))}
							</span>
						</p>
						<div>
							{viewerRole === 'Task Performer' || viewerRole === 'Task Poster' ? (
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-2">
										<label className="text-gray-700 text-lg font-semibold">Top Skills:</label>
										<p className="text-gray-700">{topSkills.join(', ') || 'No skills listed'}</p>
									</div>
								</div>
							) : (
								<p className="text-gray-700 font-semibold text-small">{adjustedSkills}</p>
							)}
						</div>
					</div>
					<p>
						<span className="text-gray-700 text-lg font-semibold mb-2">Role:</span> {viewerRole}
					</p>

					{/* Email and phone number are only openly displayed for task performers.*/}
					{viewerRole === 'Task Performer' && (
						<>
							<div className="flex items-center gap-2">
								<label className="text-gray-700 text-lg font-semibold">Email:</label>
								<input
									placeholder="example@email.com"
									className="border px-4 py-1"
									value={adjustedEmail}
									onChange={(input) => setUpdatedEmail(input.target.value)}
								/>
							</div>
							<div className="flex items-center gap-2">
								<label className="text-gray-700 text-lg font-semibold">Phone Number:</label>
								<input
									placeholder="e.g.,(123)-456-7890"
									className="border px-4 py-1"
									value={adjustedPhoneNumber}
									onChange={(input) => setUpdatedPhoneNumber(input.target.value)}
								/>
							</div>
						</>
					)}

					{/* About and Recent Jobs and More Skills */}
					<div className="flex gap-8">
						<div className="flex-1 flex flex-col">
							{/* Recent Jobs Box */}
							<div>
								<h2 className="text-xl font-bold mb-1 p-1">Recent Jobs</h2>
								<div className="border border-black rounded-lg p-6 mb-8 mt-2">
									<div className="space-y-2">
										{recentJobs.map((job, index) => (
											<p key={index}>
												<span className="font-semibold">{job.title}:</span>{' '}
												{'⭐'.repeat(Math.floor(job.rating))}
												{'☆'.repeat(5 - Math.floor(job.rating))}
											</p>
										))}
									</div>
								</div>
							</div>

							{/* More Skills Box */}
							<div>
								<h2 className="text-xl font-bold mb-1 p-1">More Skills</h2>
								<div className="border border-black rounded-lg p-6 mb-8 mt-2">
									{viewerRole === 'Task Performer' ? (
										<div className="block">
											<p className="text-sm text-black mb-2 p-1">
												First 3 skills appear under Top Skills.
											</p>
											<textarea
												placeholder="e.g., Cooking, Cleaning, Organizing"
												className="border px-4 py-2 w-full h-32 rounded-md resize-none"
												value={adjustedSkills}
												onChange={(input) => setUpdatedSkills(input.target.value)}
											/>
										</div>
									) : (
										<p className="text-black text-sm">{skills}</p>
									)}
								</div>
							</div>
						</div>
						{/* Reviews Box */}
						<div className="w-full max-w-md flex flex-col">
							<h2 className="text-xl font-bold mb-1 p-1">Reviews</h2>
							<div className="border border-black rounded-lg p-4 sm:p-6 mb-8 mt-2">
								<div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2">
									{fetchedReviews.length > 0 ? (
										[...fetchedReviews].reverse().map((review, index) => (
											<ReviewCard
												key={index}
												reviewerName={review.reviewerName}
												reviewerProfilePicture={review.reviewerProfilePicture}
												jobTitle={review.jobTitle}
												rating={review.rating}
												comment={review.comment}
											/>
										))
									) : (
										<p className="text-black">No reviews yet.</p>
									)}
								</div>
							</div>
						</div>
						{/*Saving changes*/}
						{viewerRole === 'Task Performer' && (
							<div className="flex justify-end mt-4">
								<button
									className="absolute bottom-5 right-50 bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-full"
									onClick={Save}
								>
									Save Changes
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
