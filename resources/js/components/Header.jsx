import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Utsav Decorise</h1>
                <ul className="flex space-x-4">
                    <li><NavLink to="/" className="hover:underline">Home</NavLink></li>
                    <li><NavLink to="/service" className="hover:underline">Service</NavLink></li>
                    <li><NavLink to="/about" className="hover:underline">About</NavLink></li>
                    <li><NavLink to="/contact" className="hover:underline">Contact</NavLink></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;