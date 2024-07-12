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
import { useState } from "react";
import { addUser } from "../../lib/users";
import { useRouter } from 'next/navigation';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserAdded: () => void;
}

export default function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("Manager");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fullNameError, setFullNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const toast = useToast();
    const router = useRouter();

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

    const handleAddUser = async () => {
        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        try {
            await addUser(fullName, email, password, role);
            toast({
                title: "User added.",
                description: `User ${fullName} added successfully.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onUserAdded();
            window.location.href ='/users'
            onClose();
        } catch (error) {
            console.error("Error adding user:", error);
            toast({
                title: "Error",
                description: "There was an error adding the user.",
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
                <ModalHeader>Add User</ModalHeader>
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
                        onClick={handleAddUser}
                        ml={3}
                        isLoading={isLoading}
                        isDisabled={isLoading || !!fullNameError || !!emailError || !!passwordError}
                    >
                        Add User
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
