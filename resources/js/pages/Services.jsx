import React from 'react';
import InquiryForm from '../components/InquiryForm';

function Services() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Event Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="mb-8">
              <span className="text-white/80 uppercase tracking-widest">
                Creating Unforgettable Memories
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Transform Your Events Into 
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}Extraordinary Experiences
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto lg:mx-0">
              Professional event management services that combine innovation, precision, 
              and creativity to bring your vision to life.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg text-lg font-semibold text-white transition-all transform hover:scale-105">
                Start Planning Now
              </button>
              <button className="border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-lg text-lg font-semibold text-white transition-all">
                Watch Showreel
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="lg:w-1/2 mt-16 lg:mt-0">
            <div className="grid grid-cols-2 gap-8 backdrop-blur-sm bg-white/10 p-8 rounded-2xl border border-white/10">
              <div className="col-span-2 sm:col-span-1">
                <div className="text-4xl font-bold text-cyan-400 mb-2">15+</div>
                <div className="text-white/80">Years Experience</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-4xl font-bold text-purple-400 mb-2">2K+</div>
                <div className="text-white/80">Events Organized</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-4xl font-bold text-blue-400 mb-2">98%</div>
                <div className="text-white/80">Client Satisfaction</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-4xl font-bold text-pink-400 mb-2">50+</div>
                <div className="text-white/80">Awards Won</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
          <div className="animate-bounce w-8 h-14 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-2 h-2 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-40 w-24 h-24 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-32 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed" />
    </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img 
              src="https://picsum.photos/400/300?wedding" 
              alt="Wedding Decor" 
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h3 className="text-2xl font-bold mt-4 mb-2">Wedding Decorations</h3>
            <p className="text-gray-600">Complete wedding venue transformation with floral arrangements and lighting</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img 
              src="https://picsum.photos/400/300?corporate" 
              alt="Corporate Events" 
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h3 className="text-2xl font-bold mt-4 mb-2">Corporate Events</h3>
            <p className="text-gray-600">Professional event management for conferences and product launches</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img 
              src="https://picsum.photos/400/300?birthday" 
              alt="Birthday Parties" 
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h3 className="text-2xl font-bold mt-4 mb-2">Birthday Parties</h3>
            <p className="text-gray-600">Custom themed celebrations for all ages</p>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/2">
              <img 
                src="https://picsum.photos/600/400?event" 
                alt="Event Planning" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Complete Event Planning</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                From concept to execution, we handle every detail of your special occasion. 
                Our team manages venue selection, vendor coordination, theme development, 
                and day-of coordination to ensure flawless execution.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <span>Venue Selection</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">📋</span>
                  <span>Vendor Management</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">🎨</span>
                  <span>Theme Design</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">👔</span>
                  <span>Staff Coordination</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <div className="text-4xl font-bold mb-2">15+</div>
            <div className="opacity-90">Years Experience</div>
          </div>
          <div className="p-4">
            <div className="text-4xl font-bold mb-2">2K+</div>
            <div className="opacity-90">Events Organized</div>
          </div>
          <div className="p-4">
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="opacity-90">Client Satisfaction</div>
          </div>
          <div className="p-4">
            <div className="text-4xl font-bold mb-2">50+</div>
            <div className="opacity-90">Awards Won</div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Work Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <img src="https://picsum.photos/300/200?gallery1" alt="Gallery 1" className="w-full h-48 object-cover rounded-lg" />
            <img src="https://picsum.photos/300/200?gallery2" alt="Gallery 2" className="w-full h-48 object-cover rounded-lg" />
            <img src="https://picsum.photos/300/200?gallery3" alt="Gallery 3" className="w-full h-48 object-cover rounded-lg" />
            <img src="https://picsum.photos/300/200?gallery4" alt="Gallery 4" className="w-full h-48 object-cover rounded-lg" />
            <img src="https://picsum.photos/300/200?gallery5" alt="Gallery 5" className="w-full h-48 object-cover rounded-lg" />
            <img src="https://picsum.photos/300/200?gallery6" alt="Gallery 6" className="w-full h-48 object-cover rounded-lg" />
            <img src="https://picsum.photos/300/200?gallery7" alt="Gallery 7" className="w-full h-48 object-cover rounded-lg" />
            <img src="https://picsum.photos/300/200?gallery8" alt="Gallery 8" className="w-full h-48 object-cover rounded-lg" />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our 4-Step Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Consultation</h3>
              <p className="text-gray-600">Initial meeting to understand your vision</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Planning</h3>
              <p className="text-gray-600">Detailed event blueprint creation</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Preparation</h3>
              <p className="text-gray-600">Vendor coordination and logistics</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">4</div>
              <h3 className="text-xl font-bold mb-2">Execution</h3>
              <p className="text-gray-600">Flawless event implementation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Client Testimonials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 mb-6">"The best event planners we've ever worked with! Every detail was perfect."</p>
              <div className="flex items-center">
                <img src="https://i.pravatar.cc/100?img=1" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-bold">Sarah Johnson</div>
                  <div className="text-gray-500 text-sm">Wedding Client</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 mb-6">"The best event planners we've ever worked with! Every detail was perfect."</p>
              <div className="flex items-center">
                <img src="https://i.pravatar.cc/100?img=1" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-bold">Sarah Johnson</div>
                  <div className="text-gray-500 text-sm">Wedding Client</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 mb-6">"The best event planners we've ever worked with! Every detail was perfect."</p>
              <div className="flex items-center">
                <img src="https://i.pravatar.cc/100?img=1" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-bold">Sarah Johnson</div>
                  <div className="text-gray-500 text-sm">Wedding Client</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 mb-6">"The best event planners we've ever worked with! Every detail was perfect."</p>
              <div className="flex items-center">
                <img src="https://i.pravatar.cc/100?img=1" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-bold">Sarah Johnson</div>
                  <div className="text-gray-500 text-sm">Wedding Client</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 mb-6">"The best event planners we've ever worked with! Every detail was perfect."</p>
              <div className="flex items-center">
                <img src="https://i.pravatar.cc/100?img=1" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-bold">Sarah Johnson</div>
                  <div className="text-gray-500 text-sm">Wedding Client</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 mb-6">"The best event planners we've ever worked with! Every detail was perfect."</p>
              <div className="flex items-center">
                <img src="https://i.pravatar.cc/100?img=1" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-bold">Sarah Johnson</div>
                  <div className="text-gray-500 text-sm">Wedding Client</div>
                </div>
              </div>
            </div>
            {/* Add more testimonial blocks */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Planning Your Event</h2>
          <p className="text-xl mb-8">Contact us today for a free consultation</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Schedule Now
          </button>
        </div>
      </section>

      {/* Inquiry Form */}
      <InquiryForm />
    </div>
  );
}

export default Services;