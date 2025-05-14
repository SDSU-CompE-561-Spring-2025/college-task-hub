'use client';
import React from 'react';

export default function AboutSection() {
  return (
    <div className="flex gap-16">
      <div className="w-xl mx-auto p-8 mt-10 mb-30 text-center bg-sky-200 rounded-lg shadow-md">
        <h1 id="about" className="text-5xl pb-10 scroll-mt-12">About</h1>
        <p className="text-xl">
          Looking for a way to earn extra cash around your class schedule? Our free platform connects college students with quick, flexible gigs! Everything from dog-walking and tutoring to helping someone move, so you can pick up work whenever you have a spare hour. Simply sign up, build your profile with your skills and location, and browse available tasks; when a job that matches you pops up nearby, you'll get a notification and can choose to accept or decline in one click. No long-term commitment, no hidden fees. Just on-demand work that fits your life. Ready to make money on your terms? Sign up today!
        </p>
      </div>

      <div className="w-xl mx-auto p-8 mt-10 mb-30 text-center bg-sky-200 rounded-lg shadow-md">
        <h1 id="Developers" className="text-5xl pb-30">Developers</h1>
        <div className="flex flex-col items-center">
          <h3 className="text-xl">Grace Peebles</h3>
          <h3 className="text-xl">Konrad Kapusta</h3>
          <h3 className="text-xl">Omar Badr</h3>
          <h3 className="text-xl">Robert Rodarte</h3>
          <h3 className="text-xl">Tori Nguyen</h3>
        </div>
      </div>
    </div>
  );
}
