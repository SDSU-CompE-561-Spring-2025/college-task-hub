"use client";

import React, { useEffect, useState } from 'react';

interface ReviewCardProps {
  reviewerName: string;
  reviewerProfilePicture: string;
  jobTitle: string;
  rating: number;
  comment: string;
}

export default function ReviewCard({
  reviewerName,
  reviewerProfilePicture,
  jobTitle,
  rating,
  comment,
  
}: ReviewCardProps) {
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  useEffect(() => {
    const gender = Math.random() < 0.5 ? "men" : "women";
    const number = Math.floor(Math.random() * 100);
    const url = `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
    setProfilePictureUrl(url);
  }, []);
  return (
    <div className="border-b pb-4 last:border-none">
      {/* Profile picture, name, & task */}
      <div className="flex items-center space-x-4 mb-2">
        <img
          src={profilePictureUrl || "https://randomuser.me/api/portraits/men/75.jpg"} 
          alt="Reviewer profile" 
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      {/* Rating */}
      <p className="text-lg mb-2">
        {"⭐".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      </p>

      {/* Comment */}
      <p className="text-gray-700">{comment}</p>
    </div>
  );
}
