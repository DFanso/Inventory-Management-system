"use client"
import { Box, Button, FormControl, FormLabel, Input, VStack, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { login } from '../lib/login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const result = await login(email, password);
            Cookies.set('token', result.accessToken, { expires: 7, secure: true, sameSite: 'strict' });
            toast.success('Login successful!');
            router.push('/');
        } catch (error) {
            toast.error('Login failed!');
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            backgroundColor="#f0f4f8"
        >
            <Box
                backgroundColor="white"
                p={8}
                borderRadius="lg"
                boxShadow="lg"
                maxWidth="md"
                width="100%"
            >
                <VStack spacing={4} align="stretch">
                    <FormControl id="email" isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        backgroundColor="#0052ea"
                        color="white"
                        _hover={{ backgroundColor: "#003bb5" }}
                        onClick={handleLogin}
                        width="100%"
                        mt={4}
                        isDisabled={loading}
                    >
                        {loading ? <Spinner size="sm" /> : 'Login'}
                    </Button>
                </VStack>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default LoginPage;
