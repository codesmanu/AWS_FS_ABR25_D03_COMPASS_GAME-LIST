import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Home from './pages/Home/Home';
import Login from './pages/loginPages/login';
import RegisterLogin from './pages/loginPages/registerLogin';
import Platform from './pages/Platforms/Platform';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Games from './pages/Games/Games';
import Categories from './pages/Categories/Categories';

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
