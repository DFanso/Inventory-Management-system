import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface WithAuthProps {
    children?: React.ReactNode;
}

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>, allowedRoles: string[] = []) => {
    const Wrapper: React.FC<P & WithAuthProps> = (props) => {
        const router = useRouter();

        useEffect(() => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const userString = localStorage.getItem('user');
                    if (userString) {
                        const user = JSON.parse(userString);
                        const currentTime = Date.now() / 1000;
                        if (user.exp && user.exp < currentTime) {
                            Cookies.remove('token');
                            router.push('/login');
                        } else if (allowedRoles.length && !allowedRoles.includes(user.role)) {
                            router.push('/unauthorized');
                        }
                    } else {
                        router.push('/login');
                    }
                } catch (error) {
                    console.error('Error reading user data:', error);
                    router.push('/login');
                }
            } else {
                router.push('/login');
            }
        }, [router]);

        return <WrappedComponent {...(props as P)} />;
    };

    Wrapper.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

    return Wrapper;
};

function getDisplayName<P>(WrappedComponent: React.ComponentType<P>): string {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;
