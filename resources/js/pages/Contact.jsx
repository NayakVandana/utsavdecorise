import React from 'react';
import InquiryForm from '../components/InquiryForm';

function Contact() {
  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row">
      <div className="md:w-2/3">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="mb-4">Email: info@utsavdecorise.com | Phone: +123-456-7890</p>
      </div>
      <div className="md:w-1/3">
        <InquiryForm />
      </div>
    </div>
  );
}

export default Contact;