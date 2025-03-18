import React from 'react';
import InquiryForm from '../components/InquiryForm';

function About() {
  return (
    <div className="container mx-auto p-4 pt-20 min-h-screen">
      
        {/* Main Content */}
        <div className="flex items-center flex-col gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">About Us</h1>
          <p className="text-gray-700 text-sm sm:text-base">
            We are a team dedicated to making your events special with unique decor.
          </p>
        </div>

        {/* Inquiry Form */}
        <InquiryForm />
      
    </div>
  );
}

export default About;