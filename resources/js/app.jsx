import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import AdminInquiries from './components/AdminInquiries';

const container = document.getElementById('app');
const adminContainer = document.getElementById('admin-app');
import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

if (container) {
    const root = createRoot(container);
    root.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

if (adminContainer) {
    const adminRoot = createRoot(adminContainer);
    adminRoot.render(<AdminInquiries />);
}