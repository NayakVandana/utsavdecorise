import React from 'react';
import InquiryForm from '../components/InquiryForm';

function Services() {
  return (
    <div className="container mx-auto p-4 pt-20 min-h-screen">
     
        {/* Main Content */}
        <div className="flex items-center flex-col gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Our Services</h1>
          <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base">
            <li>Wedding Decorations</li>
            <li>Birthday Celebrations</li>
            <li>Corporate Events</li>
          </ul>
        </div>

        {/* Inquiry Form */}
        <InquiryForm />
      </div>
  );
}

export default Services;