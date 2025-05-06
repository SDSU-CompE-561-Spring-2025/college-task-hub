'use client';
import React from 'react';

interface TaskCardProps {
    taskName: string;
    section?: string;
    profilePicUrl?: string;
    description?: string;
}

export default function TaskCard({ taskName, section, profilePicUrl, description }: TaskCardProps) {
  return (
    <div className="w-[200px] h-[150px] p-4 bg-gray-200 rounded-2xl hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
      <div className="flex items-center gap-20 mb-2">
        <h2 className="text-lg font-medium">{taskName}</h2>
        {profilePicUrl && (
          <img
            src={profilePicUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
      </div>
      {description && <p className="text-sm text-gray-500 break-words text-ellipsis w-full overflow-hidden">{description}</p>}
    </div>
  );
}
