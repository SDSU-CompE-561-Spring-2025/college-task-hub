'use client';
import React from 'react';

export default function ToolClusterRight() {
  return (
    <div className="relative w-70">
      <img
        src="/images/router.webp"
        alt="router"
        className="absolute max-w-none right-0 w-40 h-auto -top-60 -mr-16"
      />
      <img
        src="/images/drill.png"
        alt="drill"
        className="absolute max-w-none right-0 w-76 h-auto -top-28 -mr-24 rotate-25"
      />
      <img
        src="/images/paintbrush.png"
        alt="paintbrush"
        className="absolute max-w-none right-0 w-36 h-auto top-12 -mr-8 -rotate-64"
      />
    </div>
  );
}
