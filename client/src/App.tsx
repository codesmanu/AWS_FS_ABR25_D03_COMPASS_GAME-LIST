import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Home from './pages/home/Home';
import Login from './pages/login/login';
import RegisterLogin from './pages/login/register';
import Platform from './pages/platforms/Platform';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Games from './pages/games/Games';
import Categories from './pages/categories/Categories';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <SignedOut>
                            <Login />
                        </SignedOut>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <SignedOut>
                            <RegisterLogin />
                        </SignedOut>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <>
                            <SignedIn>
                                <Home />
                            </SignedIn>
                            <SignedOut>
                                <Navigate to="/login" replace />
                            </SignedOut>
                        </>
                    }
                />

                <Route
                    path="/games"
                    element={
                        <>
                            <SignedIn>
                                <Games />
                            </SignedIn>
                            <SignedOut>
                                <Navigate to="/login" replace />
                            </SignedOut>
                        </>
                    }
                />

                <Route
                    path="/categories"
                    element={
                        <>
                            <SignedIn>
                                <Categories />
                            </SignedIn>
                            <SignedOut>
                                <Navigate to="/login" replace />
                            </SignedOut>
                        </>
                    }
                />

                <Route
                    path="/platforms"
                    element={
                        <>
                            <SignedIn>
                                <Platform />
                            </SignedIn>
                            <SignedOut>
                                <Navigate to="/login" replace />
                            </SignedOut>
                        </>
                    }
                />

                <Route
                    path="*"
                    element={
                        <>
                            <SignedIn>
                                <Navigate to="/dashboard" replace />
                            </SignedIn>
                            <SignedOut>
                                <Navigate to="/login" replace />
                            </SignedOut>
                        </>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}