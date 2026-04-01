import { useState } from 'react';
import './Remove.css';

const background_style: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgb(0,0,0, 0.7)',
    zIndex: 1000,
};

interface RemoveProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
}

const Remove: React.FC<RemoveProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemName = 'item',
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div style={background_style} role="dialog">
                <div className="remove-container">
                    <div className="remove-box">
                        <div className="remove-close" onClick={onClose}>
                            x
                        </div>
                        <div className="remove-icon" />
                        <div className="remove-text">
                            <h1>Are you sure?</h1>
                            <p>
                                Deleting this {itemName} will permanently remove
                                it from the system. This action is not
                                reversible.
                            </p>
                        </div>
                        <div className="remove-buttons">
                            <button
                                className="remove-button_no"
                                onClick={onClose}
                            >
                                No, cancel action
                            </button>
                            <button
                                className="remove-button_yes"
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                Yes, delete this
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Remove;
