import type { ReactNode } from 'react';
import Button from '../Button/Button';
import './Card.css';
import { GoPlus } from 'react-icons/go';

type CardProps = {
  icon: ReactNode;
  title: string;
  total: number;
  canAdd?: boolean;
};

const Card = ({ icon, title, total, canAdd = true }: CardProps) => {
  return (
    <div id="card">
      <div className="content">
        <div className="card-icon">{icon}</div>
        <span>{title}</span>
        {canAdd && (
          <Button className="card-button">
            <GoPlus className="plus-icon" />
            Add new
          </Button>
        )}
      </div>
      <h3 className="card-total">{total}</h3>
    </div>
  );
};

export default Card;
