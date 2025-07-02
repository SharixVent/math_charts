import { Sectors } from './components/sectors/Sectors.tsx';
import './App.css';

function App() {
    return (
        <>
            {/* Title and logo */}
            <div className="title-sector">
                <img src="/logo.png" className='logo' alt="Logo" />
                <div className="title">Math Charts</div>
            </div>

            {/* Sectors */}
            <Sectors/>
        </>
    );
};

export default App;