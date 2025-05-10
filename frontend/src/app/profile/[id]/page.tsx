'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import ProfileCard from '@/components/profile/ProfileCard';
import Layout from '@/components/layout/layout';
import ProtectedRoute from '@/components/auth/protectedRoute';

export default function ProfilePage() {
	const [profileData, setProfileData] = useState<any>(null);
	const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
	const [viewerRole, setViewerRole] = useState<'Task Performer' | 'Task Poster'>('Task Performer');

	const params = useParams();
	const profileUserId = Number(params.id);

	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('access_token');
		if (!token) return; // prevent 401 fetches
		setIsReady(true);
	}, []);

	console.log('Viewing profile of userId:', profileUserId);

	useEffect(() => {
		const storedRole = localStorage.getItem('user_role');
		if (storedRole === 'performer') {
			setViewerRole('Task Performer');
		} else if (storedRole === 'poster') {
			setViewerRole('Task Poster');
		}
	}, []);

	useEffect(() => {
		if (!isReady || !profileUserId) return;

		const token = localStorage.getItem('access_token');
		if (!token) return;

		const fetchProfile = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/api/user/${profileUserId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setProfileData(res.data);
			} catch (error) {
				console.error('Error fetching profile data:', error);
			}
		};

		const fetchCurrentUser = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/api/user/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setLoggedInUserId(res.data.id);
			} catch (error) {
				console.error('Error fetching logged-in user:', error);
			}
		};

		fetchProfile();
		fetchCurrentUser();
	}, [isReady, profileUserId]);

	if (!profileData || loggedInUserId === null) {
		return <ProtectedRoute role="performer"> </ProtectedRoute>;
	}

	return (
		<Layout>
			<div className="flex flex-col items-center justify-center min-h-screen p-8">
				<ProfileCard
					userId={profileUserId}
					loggedInUserId={loggedInUserId}
					username={profileData.name}
					profilePictureUrl={profileData.profilePictureUrl}
					skills={profileData.skills}
					rating={profileData.rating}
					city={profileData.city}
					role={profileData.roles}
					viewerRole={viewerRole}
					reviews={profileData.reviews}
					email={profileData.email}
					phone_number={profileData.phone_number}
				/>
			</div>
		</Layout>
	);
}
