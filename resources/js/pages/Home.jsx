import React from 'react';
import InquiryForm from '../components/InquiryForm';

function Home() {
  return (
    <div className="container mx-auto p-4 pt-20 min-h-screen">
      {/* Main Content */}
      <div className="flex flex-col gap-10">
        {/* 1. Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-500 text-white py-16 sm:py-24 rounded-xl shadow-2xl mb-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg animate-fade-in">
              Utsav Decorise
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 px-4 font-light italic opacity-90">
              Crafting Unforgettable Moments with Elegance
            </p>
            <a
              href="/gallery"
              className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-base sm:text-lg shadow-md hover:bg-indigo-50 hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Discover Our Work
            </a>
          </div>
        </section>

        {/* 2. Welcome Message */}
        <section className="mb-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-indigo-700">Welcome to Utsav Decorise</h2>
          <p className="text-gray-600 text-base sm:text-lg px-6 max-w-2xl mx-auto">
            We specialize in turning your events into timeless celebrations with creativity, passion, and precision.
          </p>
        </section>

        {/* 3. Services Overview */}
        <section className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-center">
              <img
                src="https://images.unsplash.com/photo-1571843439991-dd2b8e051966?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                alt="Weddings"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-indigo-600">Weddings</h3>
              <p className="text-gray-600 text-sm">Dreamy decor for your big day.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-center">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                alt="Birthdays"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-indigo-600">Birthdays</h3>
              <p className="text-gray-600 text-sm">Fun and vibrant celebrations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-center">
              <img
                src="https://images.unsplash.com/photo-1571843439991-dd2b8e051966?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                alt="Corporate Events"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-indigo-600">Corporate Events</h3>
              <p className="text-gray-600 text-sm">Professional and elegant setups.</p>
            </div>
          </div>
        </section>

    {/* 4. Enhanced Why Choose Us Section */}
{/* Enhanced Why Choose Us Section */}
<section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-50">
  <div className="container mx-auto px-4">
    {/* Section Title */}
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-400">
      Why Choose Us?
    </h2>

    {/* Feature Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Feature Item 1 */}
      <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Tailored Designs</h3>
        <p className="text-gray-600 leading-relaxed">
          Customized solutions that perfectly match your vision and space requirements. Our designers work closely with you to create personalized environments.
        </p>
      </div>

      {/* Feature Item 2 */}
      <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Expert Team</h3>
        <p className="text-gray-600 leading-relaxed">
          Over a decade of industry experience with certified professionals who combine creativity and technical expertise to deliver exceptional results.
        </p>
      </div>

      {/* Feature Item 3 */}
      <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c1.657-.001,3,.895,3,2s1.343,2,3,2s3,.895,3,2s1.343,2,3,2m0,-8c1.11,.001,2.08,.402,2.599,1M12,8V7m0,1v8m0,0v1m0,-1c-.001,-1.11-.402,-2.08,-1,-2.599M21,12a9,9,18,-18,-18,-18Z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Budget-Friendly</h3>
        <p className="text-gray-600 leading-relaxed">
          Premium quality at competitive prices with flexible payment options and transparent pricing—no hidden costs.
        </p>
      </div>
    </div>
    
    {/* Call-to-action */}
    <div className="text-center mt-12">
      <a
        href="/contact-us"
        className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl"
      >
        Get Started →
      </a>
    </div>

    </div>
    
</section>


{/* 5. Enhanced Gallery Section */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">Our Portfolio</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <img
          src="https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Modern Living Room"
          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg font-semibold">Residential Design</span>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <img
          src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Contemporary Office"
          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg font-semibold">Commercial Spaces</span>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <img
          src="https://images.pexels.com/photos/7031405/pexels-photo-7031405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Luxury Bedroom"
          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg font-semibold">Luxury Interiors</span>
        </div>
      </div>
    </div>
    <div className="text-center mt-12">
      <a href="/gallery" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl">
        Explore Full Portfolio →
      </a>
    </div>
  </div>
</section>

{/* 6. Enhanced Testimonials Section */}
<section className="py-16 bg-gradient-to-br from-gray-50 to-indigo-50">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">Client Testimonials</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <img 
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Priya S" 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <h4 className="font-bold text-gray-800">Priya Sharma</h4>
            <p className="text-sm text-gray-600">Home Owner, Mumbai</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">"The team transformed our apartment into a modern masterpiece. Their attention to detail and creative solutions exceeded all our expectations!"</p>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <img 
            src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Rohan K" 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <h4 className="font-bold text-gray-800">Rohan Kapoor</h4>
            <p className="text-sm text-gray-600">CEO, TechStart Inc</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">"From concept to execution, the professionalism and creativity shown by the team was exceptional. Our office space now truly reflects our brand identity!"</p>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

        {/* 7. Call to Action */}
        <section className="mb-10 bg-indigo-600 text-white p-6 sm:p-8 rounded-lg text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Plan Your Dream Event Today</h2>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            Get in Touch
          </a>
        </section>

        {/* 8. Inquiry Form */}
        <InquiryForm />
      </div>
    </div>
  );
}

export default Home;