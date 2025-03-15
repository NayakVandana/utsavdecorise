import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./admin/AdminLayout";
import SuperAdminLayout from "./admin/SuperAdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminInquiries from "./admin/AdminInquiries";
import SuperAdminUsers from "./admin/SuperAdminUsers";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error("Failed to parse user from localStorage:", e);
            return null;
        }
    });

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log(
                    "App useEffect - User is_admin:",
                    parsedUser.is_admin
                ); // Debug
            } catch (e) {
                console.error("Failed to parse user in useEffect:", e);
                setUser(null);
            }
        }
    }, []);

    const isAuthenticated = !!token;
    const isAdmin = user?.is_admin === 1;
    const isSuperAdmin = user?.is_admin === 2;

    console.log(
        "App render - isAuthenticated:",
        isAuthenticated,
        "isAdmin:",
        isAdmin,
        "isSuperAdmin:",
        isSuperAdmin
    ); // Debug

    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Header token={token} setToken={setToken} setUser={setUser} />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route
                            path="/login"
                            element={
                                <Login setToken={setToken} setUser={setUser} />
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <Register
                                    setToken={setToken}
                                    setUser={setUser}
                                />
                            }
                        />
                        <Route
                            path="/admin/*"
                            element={
                                isAuthenticated && isAdmin ? (
                                    <AdminLayout>
                                        <Routes>
                                            <Route
                                                path="/"
                                                element={<AdminDashboard />}
                                            />
                                            <Route
                                                path="/inquiries"
                                                element={<AdminInquiries />}
                                            />
                                        </Routes>
                                    </AdminLayout>
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/superadmin/*"
                            element={
                                isAuthenticated && isSuperAdmin ? (
                                    <SuperAdminLayout>
                                        <Routes>
                                            <Route
                                                path="/"
                                                element={<AdminDashboard />}
                                            />
                                            <Route
                                                path="/inquiries"
                                                element={<AdminInquiries />}
                                            />
                                            <Route
                                                path="/users"
                                                element={<SuperAdminUsers />}
                                            />
                                        </Routes>
                                    </SuperAdminLayout>
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
