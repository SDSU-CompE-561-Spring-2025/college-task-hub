'use client';
import React from 'react';

interface TaskCardProps {
    taskName: string;
    section?: string;
    profilePicUrl?: string;
}

export default function TaskCard({ taskName, section, profilePicUrl }: TaskCardProps) {
  return (
    <div className="min-w-[200px] min-h-[150px] p-4 bg-gray-200 rounded-2xl hover:shadow-lg transition-shadow">
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
      {section && <p className="text-sm text-gray-500">Task Desc</p>}
    </div>
  );
}
