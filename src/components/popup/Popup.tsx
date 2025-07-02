import './Popup.css'

interface PopUpIn {
    title: string;
    content: string;
    onClose: () => void;
    onConfirm?: () => void;
}

export const Popup: React.FC<PopUpIn> = ({ title, content, onClose, onConfirm }) => {
    
    return (
        <div className="popup">
            <div className="popup-content">
                <h2>{title}</h2>
                <p>{content}</p>
                <div className="popup-buttons">
                    <button onClick={onClose}>Close</button>
                    {onConfirm && <button onClick={onConfirm}>Change</button>}
                </div>
            </div>
        </div>
    );
}

export default Popup;