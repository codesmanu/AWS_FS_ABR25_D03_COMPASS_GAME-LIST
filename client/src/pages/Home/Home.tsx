import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { fetchDashboardSummary } from '../../apiClient';
import { toast } from 'react-toastify';

import Header from '../../components/Header/Header';
import SideBar from '../../components/Sidebar/SideBar';
import './Home.css';
import Card from '../../components/ui/Card/Card';

import {
  IoGameControllerOutline,
  IoPricetagOutline,
  IoHardwareChipOutline,
} from 'react-icons/io5';
import { IoMdStarOutline } from 'react-icons/io';

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [userName, setUserName] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalGames: 0,
    totalCategories: 0,
    totalPlatforms: 0,
    favoriteGamesCount: 0,
  });
  const { user, isSignedIn } = useUser();

  const toggleSideBar = () => setIsSideBarOpen((prev) => !prev);

  useEffect(() => {
    if (isSignedIn && user) {
      const displayName = user.firstName || user.fullName || 'User';
      setUserName(displayName);

      const loadDashboardData = async () => {
        try {
          const response = await fetchDashboardSummary();
          setDashboardData({
            totalGames: response.data.totalGames || 0,
            totalCategories: response.data.totalCategories || 0,
            totalPlatforms: response.data.totalPlatforms || 0,
            favoriteGamesCount: response.data.favoriteGamesCount || 0,
          });
        } catch (err: any) {
          toast.error(
            err.response?.data?.message || 'Error loading dashboard data',
            {
              position: 'bottom-right',
              theme: 'dark',
            },
          );
        }

        loadDashboardData();
      };
    } else if (!isSignedIn) {
      setUserName('Guest');

      setDashboardData({
        totalGames: 0,
        totalCategories: 0,
        totalPlatforms: 0,
        favoriteGamesCount: 0,
      });
    }
  }, [user, isSignedIn]);

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
        <SideBar isOpen={isSideBarOpen} />
        <div className="content">
          <Header onToggleSideBar={toggleSideBar} />
          <div id="home-page">
            <div className="greetings">
              <h1>
                Hello, {userName || (isSignedIn ? 'Loading...' : 'Guest')}
              </h1>
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
