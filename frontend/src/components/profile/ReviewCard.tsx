"use client";

import React from 'react';

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
  return (
    <div className="border-b pb-4 last:border-none">
      {/* Profile picture, name, & task */}
      <div className="flex items-center space-x-4 mb-2">
        <img 
          src={reviewerProfilePicture} 
          alt="Reviewer profile" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-bold">{reviewerName} - <span className="font-normal">{jobTitle}</span></p>
        </div>
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
