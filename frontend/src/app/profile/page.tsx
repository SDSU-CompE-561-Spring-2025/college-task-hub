"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from '@/components/profile/ProfileCard'
import Layout from '@/components/layout/layout';

//The contact information and reviews will be pop ups so no routing needed
export default function ProfilePage() {
	const [userData, setUserData] = useState<any>(null);
  
	useEffect(() => {
	  const fetchUser = async () => {
		try {
		  const response = await axios.get("http://localhost:8000/api/user/1");
		  console.log("Fetched user:", response.data);
		  setUserData(response.data);
		} catch (error) {
		  console.error("Failed to fetch user data:", error);
		}
	  };
	  fetchUser();
	}, []);
  
	if (!userData) {
	  return <div className="text-center mt-10">Loading profile...</div>;
	}
  
	  return (
		<Layout> 
		  <div className="flex flex-col items-center justify-center min-h-screen p-8">
			<ProfileCard
			  userId={userData.id}
			  username={userData.name}
			  profilePictureUrl={userData.profilePictureUrl}
			  skills={userData.skills}
			  rating={userData.rating}
			  city = {userData.city}
			  role = {userData.roles}
			  //Two switch between viewer roles edit this line 
			  viewerRole="Task Performer" 
			  //school = {userData.school}
			  recentJobs = {userData.recentJobs}
			  reviews = {userData.reviews}
			  email = {userData.email}
			  phone_number = {userData.phone_number}

/>
	
		  </div>
		</Layout>
	  );
	  
}

