import React from 'react';
import InquiryForm from '../components/InquiryForm';

function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex  pt-20 items-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Crafting Unforgettable <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Event Experiences
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Transforming visions into reality with a decade of event management excellence
          </p>
          <img 
            src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="Team Celebration" 
            className="w-full max-w-4xl mx-auto h-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div className="p-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl">🎯</div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              To revolutionize event management through innovative design, cutting-edge technology, 
              and unparalleled attention to detail. We strive to create experiences that resonate 
              emotionally and leave lasting impressions.
            </p>
          </div>
          
          <div className="p-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center text-white text-2xl">🌍</div>
              <h2 className="text-3xl font-bold">Global Vision</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              To establish a worldwide network of creative event specialists, setting new standards 
              in 30+ countries by 2030. We aim to be the first choice for premium events across 
              cultures and continents.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Journey</h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 w-1 bg-gradient-to-b from-blue-400 to-purple-400 h-full -translate-x-1/2"></div>
            {timeline.map((item, index) => (
              <div key={index} className={`mb-16 flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                <div className="md:w-1/2 p-6">
                  <div className="bg-white p-8 rounded-2xl shadow-lg relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <h3 className="text-2xl font-bold mb-4">{item.year}</h3>
                    <p className="text-gray-600">{item.event}</p>
                    <img 
                      src={item.image} 
                      alt={item.event} 
                      className="mt-6 w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                <div className="overflow-hidden rounded-t-2xl">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-gray-600 mb-2">{member.position}</p>
                  <div className="flex gap-3 text-gray-500">
                    <a href="#" className="hover:text-blue-600">LinkedIn</a>
                    <span>•</span>
                    <a href="#" className="hover:text-blue-600">Twitter</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all">
                <div className="text-4xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-200">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
          <div className="p-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-bold text-purple-600 mb-2">2K+</div>
            <div className="text-gray-600">Events Organized</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-bold text-pink-600 mb-2">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-bold text-cyan-600 mb-2">50+</div>
            <div className="text-gray-600">Industry Awards</div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-blue-600 text-3xl mb-4">0{index + 1}</div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="mt-6 w-full h-48 object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Client Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-start gap-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xl font-bold">{testimonial.name}</div>
                    <div className="text-gray-600 mb-4">{testimonial.role}</div>
                    <div className="flex gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-gray-600">"{testimonial.text}"</p>
                <img 
                  src={testimonial.eventImage} 
                  alt="Event" 
                  className="mt-6 w-full h-48 object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-16">Common Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-blue-600">❓</span>
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <InquiryForm />
    </div>
  );
}

// Data Arrays
const timeline = [
  { 
    year: "2010", 
    event: "Founded in New York with 5-person team", 
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    year: "2014", 
    event: "Expanded to 10 major US cities", 
    image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
  },
];

const team = [
  { 
    name: "Sarah Johnson", 
    position: "CEO & Founder", 
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Sarah Johnson", 
    position: "CEO & Founder", 
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Sarah Johnson", 
    position: "CEO & Founder", 
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
  },
  // Add more team members
];

const values = [
  { 
    icon: "💎", 
    title: "Integrity", 
    description: "We maintain transparency and honesty in all our dealings" 
  },
  { 
    icon: "💎", 
    title: "Integrity", 
    description: "We maintain transparency and honesty in all our dealings" 
  },
  { 
    icon: "💎", 
    title: "Integrity", 
    description: "We maintain transparency and honesty in all our dealings" 
  },
  // Add more values
];

const process = [
  { 
    title: "Discovery Call", 
    description: "Initial consultation to understand your vision and requirements",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    title: "Discovery Call", 
    description: "Initial consultation to understand your vision and requirements",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    title: "Discovery Call", 
    description: "Initial consultation to understand your vision and requirements",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
  },
  // Add more process steps
];

const testimonials = [
  { 
    text: "The attention to detail was phenomenal. Our corporate gala exceeded all expectations!",
    name: "Michael Chen",
    role: "CEO, Tech Corp",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    eventImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    text: "The attention to detail was phenomenal. Our corporate gala exceeded all expectations!",
    name: "Michael Chen",
    role: "CEO, Tech Corp",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    eventImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
  },

  // Add more testimonials
];

const faqs = [
  { 
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 6 months in advance for large events, and 3 months for smaller gatherings to ensure availability." 
  },
  // Add more FAQs
];

export default About;