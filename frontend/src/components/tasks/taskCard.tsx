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
    <div className="flex flex-col gap-4 max-w-64 w-full bg-gray-100 p-4 rounded-lg hover:shadow-lg transition-shadow">
      <h2 className="w-full flow-text break-words text-wrap text-lg text-black">{taskName}</h2>
      {description && <p className="w-full break-words text-wrap text-gray-500 text-sm">{description}</p>}
    </div>
  );
}
