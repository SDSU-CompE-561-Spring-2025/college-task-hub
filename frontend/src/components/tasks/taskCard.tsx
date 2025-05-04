'use client';
import React from 'react';

interface TaskCardProps {
  taskName: string;
  section?: string;
}

export default function TaskCard({ taskName, section }: TaskCardProps) {
  return (
    <div className="min-w-[200px] min-h-[150px] p-4 bg-gray-200 rounded-2xl hover:shadow-lg transition-shadow">
      <h2 className="text-lg font-medium">{taskName}</h2>
      {section && <p className="text-sm text-gray-500 mt-1">Section: {section}</p>}
    </div>
  );
}
