import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';

interface JwtPayload {
  exp: number;
}

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp < currentTime) {
                    // Token expired
                    Cookies.remove('token');
                    setIsAuthenticated(false);
                    router.push('/login');
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Invalid token:', error);
                setIsAuthenticated(false);
                router.push('/login');
            }
        } else {
            setIsAuthenticated(false);
            router.push('/login');
        }
    }, [router]);

    return isAuthenticated;
};

export default useAuth;