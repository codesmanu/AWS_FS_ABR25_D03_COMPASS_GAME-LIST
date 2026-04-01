import { Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy } from 'react';
import { GET } from './utils/apiClient';
import Coockie from 'js-cookie';

const Loading = lazy(() => import('@/components/loading/Loading'));
const Layout = lazy(() => import('@/Layout'));
const Home = lazy(() => import('@/pages/home/Home'));
const Login = lazy(() => import('@/pages/login/login'));
const Register = lazy(() => import('@/pages/login/register'));
const Platform = lazy(() => import('@/pages/platforms/Platform'));
const Games = lazy(() => import('@/pages/games/Games'));
const Categories = lazy(() => import('@/pages/categories/Categories'));

export default function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const checkAuth = async () => {
            try {
                const { token, account } = await GET<{
                    token: string;
                    account: { nickname: string };
                }>('/account/refresh');
                Coockie.set('token', token);
                console.log(account.nickname);
                sessionStorage.setItem('nickname', account.nickname);
                setAuthenticated(true);
            } catch {
                Coockie.remove('token');
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) return <Loading />;

    return (
        <Routes>
            {authenticated ? (
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/platforms" element={<Platform />} />
                    <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                    />
                </Route>
            ) : (
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </>
            )}
        </Routes>
    );
}
