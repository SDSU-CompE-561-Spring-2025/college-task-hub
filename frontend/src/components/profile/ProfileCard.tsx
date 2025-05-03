"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react';
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/profile/ReviewCard";
import ContactPopUp from "@/components/profile/ContactPopUp";
import LeaveReview from "@/components/profile/LeaveReview";
import { updateProfile } from "@/lib/api/updateProfile";

interface Review {
  reviewerName: string;
  reviewerProfilePicture: string;
  jobTitle: string;
  rating: number;
  comment: string;
}

interface ProfileCardProps {
  userId: number;
  username: string;
  profilePictureUrl: string;
  skills: string;
  rating: number;
  city: string;
  role: string;
  //school: string;
  recentJobs: { title: string; rating: number }[];
  reviews: Review[];
  email: string;
  phone_number: string;
  viewerRole: "Task Performer" | "Task Poster";
  
}

export default function ProfileCard({
  userId,
  username = "No username provided",
  profilePictureUrl = "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740",
  skills = "No skills provided",
  rating = 0,
  city = "No city provided",
  role = "No role provided",
  viewerRole = "Task Poster",
  //school = "No school provided",
  recentJobs = [{ title: "No recent jobs provided", rating: 0 }],
  reviews = [
    {
      reviewerName: "No reviewer name provided",
      reviewerProfilePicture: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fprofile&psig=AOvVaw2NaRv-4R192W1QLaV0Y3IQ&ust=1746311351883000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCIi0_e_qhY0DFQAAAAAdAAAAABAE",
      jobTitle: "No job title provided",
      rating: 0,
      comment: "No comment provided",
    },
  ],
  email = "No email provided",
  phone_number = "No phone number provided",
}: ProfileCardProps) {
  console.log("Received userId:", userId);
  //const [adjustedSchool, setUpdatedSchool] = useState(school);
  const [adjustedSkills, setUpdatedSkills] = useState(skills);
  const [adjustedEmail, setUpdatedEmail] = useState(email);
  const [adjustedPhoneNumber, setUpdatedPhoneNumber] = useState(phone_number);
  const [adjustedCity, setUpdatedCity] = useState(city);
  const [fetchedReviews, setFetchedReviews] = useState<Review[]>([]);

  //top skills are the first three skills in the list
  const allSkills = adjustedSkills.split(",").map(skill => skill.trim());
  const topSkills = allSkills.slice(0, 3);

  // State to hold the reviews fetched from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/ratings/${userId}`);
        setFetchedReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [userId]);

  //Used for overall rating in profile
  const averageRating = fetchedReviews.length > 0
  ? fetchedReviews.reduce((sum, r) => sum + r.rating, 0) / fetchedReviews.length
  : 0;
  
  //Might need to add/remove school. It temporarily is set to name 
  const Save = async () => {
    console.log("Updating user ID:", userId);
    try {
      const updatedData = {
        skills: adjustedSkills,
        email: adjustedEmail,
        phone_number: adjustedPhoneNumber,
        city: adjustedCity,
        name: username,
        roles: role,
        rating: rating,
      };
      await updateProfile(userId, updatedData);
  
      // Optional: keep state in sync with backend
      setUpdatedSkills(updatedData.skills);
      setUpdatedEmail(updatedData.email);
      setUpdatedPhoneNumber(updatedData.phone_number);
  
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="relative w-full max-w-4xl p-8 rounded-lg shadow-md mx-auto border-2 border-black">

      {/* Contact & review buttons only show for the task posters*/}
      <div className="absolute top-4 right-4 flex gap-4">
        {viewerRole === "Task Poster" && (<ContactPopUp email={email} phone_number={phone_number} />)}
        {viewerRole === "Task Poster" && (<LeaveReview />)}
      </div>

      {/* Profile info */}
      <div className="flex items-center mb-8 space-x-8">
        <img 
          src={profilePictureUrl} 
          alt="Profile Picture"
          className="w-32 h-32 rounded-full object-cover"
        />
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
                  {"⭐".repeat(Math.ceil(averageRating))}{"☆".repeat(5 - Math.ceil(averageRating))}
                </span>
              </p>
            <div>
              {viewerRole==="Task Performer" || viewerRole==="Task Poster"?(
                <div className="flex items-center gap-2">
                  <div>
                    <label className="text-gray-700 text-lg font-semibold">Top Skills:</label>
                    <p className="text-gray-700">{topSkills.join(", ") || "No skills listed"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 font-semibold text-small">{adjustedSkills}</p>
              )}
            </div>
          </div>

          {/* Email and phone number are only openly displayed for task performers.*/}
          {viewerRole === "Task Performer" &&(
          <>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-lg font-semibold">Email:</label>
            <input placeholder = "example@email.com" className="border px-4 py-1" value={adjustedEmail}
            onChange={(input) => setUpdatedEmail(input.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            
            <label className="text-gray-700 text-lg font-semibold">Phone Number:</label>
            <input placeholder="e.g.,(123)-456-7890" className="border px-4 py-1" value={adjustedPhoneNumber}
            onChange={(input) => setUpdatedPhoneNumber(input.target.value)}
            />
          </div>
          </>
          )}

          {/* About and Recent Jobs and More Skills */}
          <div className="flex gap-8">
            {/* About Box */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-xl font-bold mb-1 p-1">About</h2>
              <div className="border border-black rounded-lg p-6 mb-8 mt-2">
              <p><span className="font-semibold mb-2">Role:</span> {role}</p>
              {viewerRole === "Task Performer" ? (
                  <div className="flex items-center gap-2">
                    <label className="font-semibold">City:</label>
                    <input className="border px-2 py-1 mb-2" value={adjustedCity}
                    onChange={(input) => setUpdatedCity(input.target.value)}
                    />
                </div>
                  ) : (
                  <p><span className="font-semibold">City:</span> {city}</p>
                  )}
                {/*Allow performer to edit School
                {role === "Task Performer" ? (
                  <div className="flex items-center gap-2">
                    <label className="font-semibold">School:</label>
                    <input className="border px-2 py-1" value={adjustedSchool}
                    onChange={(input) => setUpdatedSchool(input.target.value)}
                    />
                  </div>
                  ) : (
                    <p><span className="font-semibold">School:</span> {school}</p>
                  )} */}
              </div>

              {/* Recent Jobs Box */}
              <div>
                <h2 className="text-xl font-bold mb-1 p-1">Recent Jobs</h2>
                <div className="border border-black rounded-lg p-6 mb-8 mt-2">
                  <div className="space-y-2">
                    {recentJobs.map((job, index) => (
                      <p key={index}>
                        <span className="font-semibold">{job.title}:</span>{" "}
                        {"⭐".repeat(Math.floor(job.rating))}{"☆".repeat(5 - Math.floor(job.rating))}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* More Skills Box */}
              <div>
                <h2 className="text-xl font-bold mb-1 p-1">More Skills</h2>
                <div className="border border-black rounded-lg p-6 mb-8 mt-2">
                  {viewerRole === "Task Performer" ? (
                    <div className="block">
                      <p className="text-sm text-black mb-2 p-1">First 3 skills appear under Top Skills.</p>
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
            {viewerRole === "Task Performer" && (
              <div className="flex justify-end mt-4">
                <button
                  className="absolute bottom-10 right-50 bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-full"
                  onClick={Save} >
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
