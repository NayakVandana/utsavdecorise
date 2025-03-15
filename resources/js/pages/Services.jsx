import React from 'react';
import InquiryForm from '../components/InquiryForm';

function Services() {
  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row">
      <div className="md:w-2/3">
        <h1 className="text-3xl font-bold mb-4">Our Services</h1>
        <p className="mb-4">Wedding Decorations, Corporate Events, Birthday Parties, and more.</p>
      </div>
      <div className="md:w-1/3">
        <InquiryForm />
      </div>
    </div>
  );
}

export default Services;