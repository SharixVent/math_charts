interface PopUpIn {
    title: string,
    content: string,
    onClose: () => void;
}

export const Popup: React.FC<PopUpIn> = ({ title, content, onClose }) => {
    return (
        <div className="popup">
            <div className="popup-content">
                <h2>{title}</h2>
                <p>{content}</p>
                <button onClick={onClose}>Close</button>
                <button onClick={onClose}>Change</button>
            </div>
        </div>
    );
}