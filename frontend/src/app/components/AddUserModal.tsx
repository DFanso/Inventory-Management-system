// src/app/components/AddItemModal.tsx
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
} from "@chakra-ui/react";
import { useState } from "react";

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("Manager");
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState("True");
    const [password, setPassword] = useState("");

    const handleAddUser = () => {
        // Logic to handle adding the user
        console.log("User added:", { fullName, role, email, isActive, password });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Users</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="full-name" isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="role" isRequired mt={4}>
                        <FormLabel>Role</FormLabel>
                        <Select
                            placeholder="Select role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Manager">Manager</option>
                            <option value="Employee">Employee</option>
                            <option value="Admin">Admin</option>
                        </Select>
                    </FormControl>
                    <FormControl id="email" isRequired mt={4}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="isActive" isRequired mt={4}>
                        <FormLabel>IsActive</FormLabel>
                        <Select
                            placeholder="Select status"
                            value={isActive}
                            onChange={(e) => setIsActive(e.target.value)}
                        >
                            <option value="True">True</option>
                            <option value="False">False</option>
                        </Select>
                    </FormControl>
                    <FormControl id="password" isRequired mt={4}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        backgroundColor="#0052ea"
                        color="white"
                        _hover={{ backgroundColor: "#003bb5" }}
                        onClick={handleAddUser}
                        ml={3}
                    >
                        Add User
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
