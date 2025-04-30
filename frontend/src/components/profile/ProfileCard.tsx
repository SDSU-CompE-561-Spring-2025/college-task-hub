"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/profile/ReviewCard";
import ContactPopUp from "@/components/profile/ContactPopUp";
import LeaveReview from "@/components/profile/LeaveReview";
import { useState } from "react";

interface Review {
  reviewerName: string;
  reviewerProfilePicture: string;
  jobTitle: string;
  rating: number;
  comment: string;
}

interface ProfileCardProps {
  username: string;
  profilePictureUrl: string;
  skills: string;
  rating: number;
  city: string;
  role: string;
  school: string;
  recentJobs: { title: string; rating: number }[];
  reviews: Review[];
  email: string;
  phone_number: string;
  
}

export default function ProfileCard({
  username = "No username provided",
  profilePictureUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  skills = "No skills provided",
  rating = 0,
  city = "No city provided",
  role = "No role provided",
  school = "No school provided",
  recentJobs = [{ title: "No recent jobs provided", rating: 0 }],
  reviews = [
    {
      reviewerName: "No reviewer name provided",
      reviewerProfilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      jobTitle: "No job title provided",
      rating: 0,
      comment: "No comment provided",
    },
  ],
  email = "No email provided",
  phone_number = "No phone number provided",
}: ProfileCardProps) {
  const allSkills = skills.split(",").map(skill => skill.trim());
  const topSkills = allSkills.slice(0, 3);
  const [adjustedSchool, setUpdatedSchool] = useState(school);
  const [adjustedSkills, setUpdatedSkills] = useState(skills);
  const [adjustedEmail, setUpdatedEmail] = useState(email);
  const [adjustedPhoneNumber, setUpdatedPhoneNumber] = useState(phone_number);
  const [adjustedCity, setUpdatedCity] = useState(city);
  
  const Save = () => {
    const updatedInfo = {
      school: adjustedSchool,
      skills: adjustedSkills,
      email: adjustedEmail,
      phone_number: adjustedPhoneNumber,
    }
  };
    
  return (
    <div className="relative w-full max-w-4xl p-8 rounded-lg shadow-md mx-auto border-2 border-black">

      {/* Contact & review buttons only show for the task posters*/}
      <div className="absolute top-4 right-4 flex gap-4">
        {role === "Task Poster" && (<ContactPopUp email={email} phone_number={phone_number} />)}
        {role === "Task Poster" && (<LeaveReview />)}
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
                  {"⭐".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
                </span>
              </p>
            <div>
              {role==="Task Performer"?(
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 text-lg font-semibold "> Top Skills:</label>
                  <input className="border px-4 py-1" value={adjustedSkills}
                  onChange={(input) => setUpdatedSkills(input.target.value)}
                  />
                </div>
              ) : (
                <p className="text-gray-700 font-semibold text-small">{skills}</p>
              )}
            </div>
          </div>

          {/* Email and phone number are only openly displayed for task performers.*/}
          {role === "Task Performer" &&(
          <>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-lg font-semibold">Email:</label>
            <input className="border px-4 py-1" value={adjustedEmail}
            onChange={(input) => setUpdatedEmail(input.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-lg font-semibold">Phone Number:</label>
            <input className="border px-4 py-1" value={adjustedPhoneNumber}
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
              {role === "Task Performer" ? (
                  <div className="flex items-center gap-2">
                    <label className="font-semibold">City:</label>
                    <input className="border px-2 py-1 mb-2" value={adjustedCity}
                    onChange={(input) => setUpdatedCity(input.target.value)}
                    />
                </div>
                  ) : (
                  <p><span className="font-semibold">City:</span> {city}</p>
                  )}
                {/*Allow performer to edit School */}
                {role === "Task Performer" ? (
                  <div className="flex items-center gap-2">
                    <label className="font-semibold">School:</label>
                    <input className="border px-2 py-1" value={adjustedSchool}
                    onChange={(input) => setUpdatedSchool(input.target.value)}
                    />
                </div>
                  ) : (
                    <p><span className="font-semibold">School:</span> {school}</p>
                  )}
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
                 {role==="Task Performer"?(
                  <div className="flex items-center gap-2">
                    <textarea className = "border px-4 py-2 w-full h-32 rounded-md resize-none" value={adjustedSkills}
                    onChange={(input) => setUpdatedSkills(input.target.value)}/> 
                </div>
                ) : (
                  <p className="text-black text-small">{skills}</p>
                )}
              </div>
          </div>
        </div>
        {/* Reviews Box */}
            <div className="w-[400px] flex flex-col">
              <h2 className="text-xl font-bold mb-1 p-1">Reviews</h2>
              <div className="border border-black rounded-lg p-6 mb-8 mt-2 space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <ReviewCard
                      key={index}
                      reviewerName={review.reviewerName}
                      reviewerProfilePicture={review.reviewerProfilePicture}
                      jobTitle={review.jobTitle}
                      rating={review.rating}
                      comment={review.comment}/>
                  ))
                ) : (
                  <p className="text-black">No reviews yet.</p>
                )}
              </div>
            </div>
            {/*Saving changes*/}
            {role === "Task Performer" && (
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
