import { Link, useLocation } from "react-router-dom";

const TopLogo = () => {
    const location = useLocation();

    if (location.pathname === '/') return null;

    return (
        <Link to="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 hidden sm:block">
            <img
                src="/triovate.png"
                alt="Triovate Labs"
                className="h-20 sm:h-28 md:h-32 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.3))' }}
            />
        </Link>
    );
};

export default TopLogo;
