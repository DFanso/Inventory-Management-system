'use client'
import { Box, Flex, Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { UserRole } from '../../../types/users.types';

const Navbar = () => {
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const router = useRouter();

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            setUserRole(user.role as UserRole);
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <Box as="nav" bg="white" borderBottom="1px" borderColor="gray.200" px={4} py={4}>
            <Flex justify="space-between" align="center">
                <Link href="/" passHref>
                    <Text fontSize="lg" fontWeight="bold" cursor="pointer">
                        Inventory Management System
                    </Text>
                </Link>
                <Flex>
                    {userRole === UserRole.ADMIN && (
                        <Button
                            backgroundColor="#0052ea"
                            color="white"
                            _hover={{ backgroundColor: "#003bb5" }}
                            mr={4}
                        >
                            Manage Users
                        </Button>
                    )}
                    <Button
                        backgroundColor="#e53e3e"
                        color="white"
                        _hover={{ backgroundColor: "#c53030" }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Navbar;
