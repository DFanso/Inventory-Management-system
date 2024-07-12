"use client"
import { Box, Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Logic to handle login
        console.log("Login details:", { email, password });
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
                    >
                        Login
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
}
