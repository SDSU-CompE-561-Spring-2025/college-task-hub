'use client';

import React, { useState, useEffect } from 'react';

type JobPost = {
  title: string;
  category: string;
  location: string;
  rating: number;
};

export default function JobPostFilterByCategory() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch job posts from backend API
    fetch('http://localhost:8000/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobPosts(data))
      .catch((err) => console.error('Error fetching jobs:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredJobs = jobPosts.filter((job) => {
    return selectedCategory === '' || job.category === selectedCategory;
  });

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Filter by Category</h1>

      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border px-4 py-2 rounded mb-6 w-full"
      >
        <option value="">All Categories</option>
        <option value="Pet Care">Pet Care</option>
        <option value="Home Services">Home Services</option>
        <option value="Labor">Labor</option>
        <option value="Errands">Errands</option>
      </select>

      {/* Job Cards */}
      {isLoading ? (
        <p>Loading...</p>
      ) : filteredJobs.length === 0 ? (
        <p>No jobs found in this category.</p>
      ) : (
        <ul className="space-y-4">
          {filteredJobs.map((job, index) => (
            <li key={index} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p>{job.category} • {job.location}</p>
              <p>Rating: {job.rating}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
