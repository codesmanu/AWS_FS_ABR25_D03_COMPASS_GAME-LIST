import { type ReactNode, useState } from 'react';
import Button from '../ui/Button/Button';
import './Header.css';
import { IoArrowBackCircleOutline } from 'react-icons/io5';

type HeaderProps = {
  children?: ReactNode;
  onToggleSideBar: () => void;
};

const Header = ({ children, onToggleSideBar }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    onToggleSideBar();
  };

  return (
    <div id="header">
      <Button className="back-button" onClick={handleToggle}>
        <IoArrowBackCircleOutline
          className={`arrow-back ${isOpen ? 'open-arrow' : 'closed-arrow'}`}
        />
      </Button>
      <h2 className="section-title">{children}</h2>
    </div>
  );
};

export default Header;
