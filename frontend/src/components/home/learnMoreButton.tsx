'use client';
import React from 'react';

export default function LearnMoreButton() {
  const handleScroll = () => {
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="pb-30 mt-5 text-center cursor-pointer"
      onClick={handleScroll}
    >
      <p className="font-semibold text-lg">Learn More ↓</p>
    </div>
  );
}
