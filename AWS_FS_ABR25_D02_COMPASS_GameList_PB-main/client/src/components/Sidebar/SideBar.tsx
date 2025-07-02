import { useClerk } from '@clerk/clerk-react';
import Button from '../ui/Button/Button';
import { useNavigate, useLocation } from 'react-router-dom';

import './SideBar.css';
import { VscSignOut } from 'react-icons/vsc';
import {
  IoHomeOutline,
  IoGameControllerOutline,
  IoPricetagOutline,
  IoHardwareChipOutline,
} from 'react-icons/io5';

type SideBarProps = {
  isOpen: boolean;
};

const Sidebar = ({ isOpen }: SideBarProps) => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const isLinkActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className={`${isOpen ? 'sidebar' : 'closed-sidebar'}`}>
        <img src="/logo.svg" className="logo" />

        <div className="navigation">
          <Button
            className={`button ${isLinkActive('/dashboard') ? 'selected' : ''}`}
            onClick={() => {
              navigate('/dashboard');
            }}
          >
            <IoHomeOutline className="icon" />
            <span>Home</span>
          </Button>
          <Button
            className={`button ${isLinkActive('/games') ? 'selected' : ''}`}
            onClick={() => {
              navigate('/games');
            }}
          >
            <IoGameControllerOutline className="icon" />
            <span>Games</span>
          </Button>
          <Button
            className={`button ${isLinkActive('/categories') ? 'selected' : ''}`}
            onClick={() => {
              navigate('/categories');
            }}
          >
            <IoPricetagOutline className="icon" />
            <span>Categories</span>
          </Button>
          <Button
            className={`button ${isLinkActive('/platforms') ? 'selected' : ''}`}
            onClick={() => {
              navigate('/platforms');
            }}
          >
            <IoHardwareChipOutline className="icon" />
            <span>Platforms</span>
          </Button>
        </div>

        <div className="logout">
          <Button
            className="button"
            onClick={() => signOut({ redirectUrl: '/login' })}
          >
            <span>Logout</span>
            <VscSignOut className="icon" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
