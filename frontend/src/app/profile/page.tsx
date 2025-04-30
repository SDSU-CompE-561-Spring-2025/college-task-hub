import React from 'react';
import ProfileCard from '@/components/profile/ProfileCard'
import Layout from '@/components/layout/layout';

//The contact information and reviews will be pop ups so no routing needed
export default function ProfilePage() {
	const userData = {
		username : "MyTaskPerfomerUsername",
		profilePictureUrl : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740",
		skills : "Dog Walking, House Sitting, Moving Help, Pet Sitting, House Cleaning, Lawn Care, Snow Removal, Furniture Assembly, Car Washing, Grocery Shopping",
		rating : 4.5,
		city : "San Diego",
		role : "Task Performer",
		school : "San Diego State University",
		recentJobs : [
			{ title: "Dog Walking", rating: 5 },
			{ title: "House Sitting", rating: 4 },
			{ title: "Moving Help", rating: 4.5 }],
		reviews: [
			{
				reviewerName: "Jane Doe",
				reviewerProfilePicture: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740",
				jobTitle: "Dog Walking",
				rating: 5,
				comment: "Great job!"
			},
			{
				reviewerName: "John Smith",
				reviewerProfilePicture: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740",
				jobTitle: "House Sitting",
				rating: 4,
				comment: "Very professional and friendly."
			},
			{
				reviewerName: "Alice Johnson",
				reviewerProfilePicture: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740",
				jobTitle: "Moving Help",
				rating: 5,
				comment: "Highly recommend!"
			}
			],
			email: "user@email.com",
  			phone_number: "(123) 456-7890",

	  };


	
	  return (
		<Layout> 
		  <div className="flex flex-col items-center justify-center min-h-screen p-8">
			<ProfileCard
			  username={userData.username}
			  profilePictureUrl={userData.profilePictureUrl}
			  skills={userData.skills}
			  rating={userData.rating}
			  city = {userData.city}
			  role = {userData.role}
			  school = {userData.school}
			  recentJobs = {userData.recentJobs}
			  reviews = {userData.reviews}
			  email = {userData.email}
			  phone_number = {userData.phone_number}

/>
	
		  </div>
		</Layout>
	  );
	  
}

