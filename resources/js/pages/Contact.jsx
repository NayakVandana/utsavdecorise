import React from 'react';
import InquiryForm from '../components/InquiryForm';

function Contact() {
  return (
    <div className="container mx-auto p-4 pt-20 min-h-screen">
    
        {/* Main Content */}
        <div className="flex items-center flex-col gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Contact Us</h1>
          <p className="mb-4 text-sm sm:text-base">Email: info@utsavdecorise.com | Phone: +123-456-7890</p>
        </div>

        {/* Inquiry Form */}
        <InquiryForm />
    
    </div>
  );
}

export default Contact;