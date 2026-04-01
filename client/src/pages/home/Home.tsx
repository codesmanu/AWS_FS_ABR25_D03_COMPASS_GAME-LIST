import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GET } from '../../utils/apiClient';

import Header from '../../components/header/Header';
import './Home.css';
import Card from '../../components/ui/Card/Card';
import { type LayoutOutletContext } from '../../Layout';

import {
    IoGameControllerOutline,
    IoPricetagOutline,
    IoHardwareChipOutline,
} from 'react-icons/io5';
import { IoMdStarOutline } from 'react-icons/io';

const Home = () => {
    const { toggleSideBar } = useOutletContext<LayoutOutletContext>();
    const [userName] = useState(sessionStorage.getItem('nickname') || 'User');
    const [dashboardData, setDashboardData] = useState({
        totalGames: 0,
        totalCategories: 0,
        totalPlatforms: 0,
        favoriteGamesCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const response = await GET<{
                    totalGames: number;
                    totalCategories: number;
                    totalPlatforms: number;
                    favoriteGamesCount: number;
                }>('/dashboard/summary');
                setDashboardData({
                    totalGames: response.totalGames || 0,
                    totalCategories: response.totalCategories || 0,
                    totalPlatforms: response.totalPlatforms || 0,
                    favoriteGamesCount: response.favoriteGamesCount || 0,
                });
            } catch (err: any) {
                toast.error(
                    err.response?.data?.message ||
                        'Error loading dashboard data',
                    {
                        position: 'bottom-right',
                        theme: 'dark',
                    },
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const categoriesToDisplay = [
        {
            icon: <IoGameControllerOutline />,
            title: 'Games',
            total: dashboardData.totalGames,
            canAdd: true,
        },
        {
            icon: <IoPricetagOutline />,
            title: 'Categories',
            total: dashboardData.totalCategories,
            canAdd: true,
        },
        {
            icon: <IoHardwareChipOutline />,
            title: 'Platforms',
            total: dashboardData.totalPlatforms,
            canAdd: true,
        },
        {
            icon: <IoMdStarOutline />,
            title: 'Favorite Games',
            total: dashboardData.favoriteGamesCount,
            canAdd: false,
        },
    ];

    return (
        <>
            <div id="home">
                <div className="content">
                    <Header onToggleSideBar={toggleSideBar} />
                    <div id="home-page">
                        <div className="greetings">
                            <h1>Hello, {loading ? 'Loading...' : userName}</h1>
                            <p>Choose one of options below.</p>
                        </div>
                        <div className="home-cards">
                            {categoriesToDisplay.map((category, index) => (
                                <Card
                                    key={index}
                                    icon={category.icon}
                                    title={category.title}
                                    total={category.total}
                                    canAdd={category.canAdd}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
