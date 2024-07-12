import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast,
    FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { updateUser } from "../../lib/users";
import { useRouter } from 'next/navigation';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: () => void;
    user: {
        id: number;
        name: string;
        role: string;
        email: string;
    };
}

export default function EditUserModal({ isOpen, onClose, onUserUpdated, user }: EditUserModalProps) {
    const [fullName, setFullName] = useState(user.name);
    const [role, setRole] = useState(user.role);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fullNameError, setFullNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        setFullName(user.name);
        setRole(user.role);
        setEmail(user.email);
    }, [user]);

    const validateInputs = () => {
        let isValid = true;

        if (!fullName) {
            setFullNameError("Full name is required.");
            isValid = false;
        } else {
            setFullNameError("");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError("Valid email is required.");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Password is required.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    const handleUpdateUser = async () => {
        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        try {
            await updateUser(user.id, fullName, email, password, role);
            toast({
                title: "User updated.",
                description: `User ${fullName} updated successfully.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onUserUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating user:", error);
            toast({
                title: "Error",
                description: "There was an error updating the user.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="full-name" isRequired isInvalid={!!fullNameError}>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                if (e.target.value) {
                                    setFullNameError("");
                                }
                            }}
                        />
                        {fullNameError && <FormErrorMessage>{fullNameError}</FormErrorMessage>}
                    </FormControl>
                    <FormControl id="role" isRequired mt={4}>
                        <FormLabel>Role</FormLabel>
                        <Select
                            placeholder="Select role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="VIEWER">VIEWER</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="ADMIN">ADMIN</option>
                        </Select>
                    </FormControl>
                    <FormControl id="email" isRequired mt={4} isInvalid={!!emailError}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (e.target.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
                                    setEmailError("");
                                }
                            }}
                        />
                        {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                    </FormControl>
                    <FormControl id="password" isRequired mt={4} isInvalid={!!passwordError}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (e.target.value) {
                                    setPasswordError("");
                                }
                            }}
                        />
                        {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        backgroundColor="#0052ea"
                        color="white"
                        _hover={{ backgroundColor: "#003bb5" }}
                        onClick={handleUpdateUser}
                        ml={3}
                        isLoading={isLoading}
                        isDisabled={isLoading || !!fullNameError || !!emailError || !!passwordError}
                    >
                        Update User
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
