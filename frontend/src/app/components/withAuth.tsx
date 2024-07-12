import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
  exp: number;
}

interface WithAuthProps {
    children: ReactNode;
}

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const Wrapper: React.FC<P & WithAuthProps> = (props) => {
        const router = useRouter();

        useEffect(() => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const decoded = jwtDecode<JwtPayload>(token);
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp && decoded.exp < currentTime) {
                        Cookies.remove('token');
                        router.push('/login');
                    }
                } catch (error) {
                    console.error('Invalid token:', error);
                    router.push('/login');
                }
            } else {
                router.push('/login');
            }
        }, [router]);

        const { children, ...rest } = props;
        return <WrappedComponent {...rest as P} />;
    };

    Wrapper.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

    return Wrapper;
};

function getDisplayName<P>(WrappedComponent: React.ComponentType<P>): string {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;