import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Service from './Service';
import About from './About';
import Contact from './Contact';
import InquiryForm from './InquiryForm';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
                <main className="flex-1 p-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/service" element={<Service />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </main>
                <aside className="w-1/4 p-4 bg-gray-100">
                    <InquiryForm />
                </aside>
            </div>
            <Footer />
        </div>
    );
}

export default App;