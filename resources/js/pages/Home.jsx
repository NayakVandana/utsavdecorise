import React from 'react';
import InquiryForm from '../components/InquiryForm';

function Home() {
  return (
    <div className="container mx-auto p-4 pt-20 min-h-screen">
      
        {/* Main Content */}
        <div className="flex flex-col gap-6">
          {/* 1. Hero Section */}
          <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-12 sm:py-20 rounded-lg shadow-lg mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Utsav Decorise</h1>
            <p className="text-lg sm:text-xl mb-6 px-4">Transforming Moments into Memories</p>
            <a href="/gallery" className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-white text-indigo-600 rounded-full hover:bg-indigo-100 transition text-sm sm:text-base">
              Explore Gallery
            </a>
          </section>

          {/* 2. Welcome Message */}
          <section className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Welcome</h2>
            <p className="text-gray-700 text-sm sm:text-base px-4">We bring creativity and elegance to every celebration.</p>
          </section>

          {/* 3. Services Overview */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Our Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-100 p-4 rounded-lg shadow text-center text-sm sm:text-base">Weddings</div>
              <div className="bg-gray-100 p-4 rounded-lg shadow text-center text-sm sm:text-base">Birthdays</div>
              <div className="bg-gray-100 p-4 rounded-lg shadow text-center text-sm sm:text-base">Corporate Events</div>
            </div>
          </section>

          {/* 4. Why Choose Us */}
          <section className="mb-8 bg-blue-50 p-4 sm:p-6 rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base">
              <li>Custom Designs</li>
              <li>Professional Team</li>
              <li>Affordable Pricing</li>
            </ul>
          </section>

          {/* 5. Gallery Preview */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Gallery Preview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <img src="/photos/sample1.jpg" alt="Sample 1" className="w-full h-32 sm:h-40 object-cover rounded" />
              <img src="/photos/sample2.jpg" alt="Sample 2" className="w-full h-32 sm:h-40 object-cover rounded" />
              <img src="/photos/sample3.jpg" alt="Sample 3" className="w-full h-32 sm:h-40 object-cover rounded" />
            </div>
          </section>

          {/* 6. Testimonials */}
          <section className="mb-8 bg-gray-100 p-4 sm:p-6 rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">What Our Clients Say</h2>
            <p className="text-gray-700 italic text-sm sm:text-base">"Amazing decor!" - Client A</p>
          </section>

          {/* 7. Our Mission */}
          <section className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 text-sm sm:text-base px-4">To make every event unforgettable.</p>
          </section>

          {/* 8. Featured Event */}
          <section className="mb-8 bg-indigo-100 p-4 sm:p-6 rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Featured Event</h2>
            <p className="text-gray-700 text-sm sm:text-base">Check out our latest wedding masterpiece!</p>
          </section>

          {/* 9. Team Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <p className="text-sm sm:text-base">Team Member 1</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <p className="text-sm sm:text-base">Team Member 2</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <p className="text-sm sm:text-base">Team Member 3</p>
              </div>
            </div>
          </section>

          {/* 10. Call to Action */}
          <section className="mb-8 bg-blue-500 text-white p-4 sm:p-6 rounded-lg text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Celebrate?</h2>
            <a href="/contact" className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-white text-blue-500 rounded-full hover:bg-gray-100 transition text-sm sm:text-base">
              Contact Us
            </a>
          </section>

          {/* 11. Our Process */}
          <section className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">How We Work</h2>
            <p className="text-gray-700 text-sm sm:text-base px-4">Consultation → Design → Execution</p>
          </section>

          {/* 12. Recent Projects */}
          <section className="mb-8 bg-gray-50 p-4 sm:p-6 rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Recent Projects</h2>
            <p className="text-gray-700 text-sm sm:text-base">See our latest works in the gallery.</p>
          </section>

          {/* 13. Partners */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Our Partners</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded mx-auto sm:mx-0"></div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded mx-auto sm:mx-0"></div>
            </div>
          </section>

          {/* 14. FAQ */}
          <section className="mb-8 bg-indigo-50 p-4 sm:p-6 rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">FAQ</h2>
            <p className="text-gray-700 text-sm sm:text-base">Q: How do I book? A: Contact us!</p>
          </section>

          {/* 15. Final CTA */}
          <section className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Let’s Create Something Beautiful</h2>
            <a href="/gallery" className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition text-sm sm:text-base">
              Get Started
            </a>
          </section>
        </div>

        {/* Inquiry Form */}
        <InquiryForm />
      
    </div>
  );
}

export default Home;