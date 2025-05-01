'use client';
import React from 'react';

export default function ToolClusterLeft() {
  return (
    <div className="relative w-70">
      <img
        src="/images/frame.png"
        alt="frame"
        className="absolute max-w-none left-0 w-64 h-auto -top-40 rotate-150 -ml-35"
      />
      <img
        src="/images/broom.png"
        alt="broom"
        className="absolute max-w-none left-0 w-40 h-auto top-12 -ml-10"
      />
    </div>
  );
}
