import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Link, useDisclosure, Spinner, Text, Select } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import AddUserModal from "./AddUserModal";
import { fetchUsers, updateUserStatus, User } from "../../lib/users"; 

export default function UserItemTable() {
    const { isOpen: isAddUserOpen, onOpen: onAddUserOpen, onClose: onAddUserClose } = useDisclosure();
    const [userList, setUserList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async () => {
        try {
            const users = await fetchUsers();
            setUserList(users);
            setError(null);
        } catch (error) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleStatusChange = async (userId: number, status: boolean) => {
        try {
            await updateUserStatus(userId, status);
            loadUsers(); 
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" color="red.500" fontSize="xl" mt={10}>
                {error}
            </Box>
        );
    }

    return (
        <Box className="max-w-6xl mx-auto">
            <Box className="flex justify-end items-center mb={4}">
                <Button
                    backgroundColor="#0052ea"
                    color="white"
                    _hover={{ backgroundColor: "#003bb5" }}
                    onClick={onAddUserOpen}
                >
                    Add Users
                </Button>
            </Box>
            <Table variant="simple" className="table-auto w-full">
                <Thead>
                    <Tr>
                        <Th>User ID</Th>
                        <Th>Display Name</Th>
                        <Th>Role</Th>
                        <Th>Is Active</Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {userList.map((user) => (
                        <Tr key={user.id}>
                            <Td>{user.id}</Td>
                            <Td>{user.name}</Td>
                            <Td>{user.role}</Td>
                            <Td>
                                <Select
                                    value={user.isActive ? "True" : "False"}
                                    onChange={(e) => handleStatusChange(user.id, e.target.value === "True")}
                                >
                                    <option value="True">True</option>
                                    <option value="False">False</option>
                                </Select>
                            </Td>
                            <Td>
                                <Link color="blue.500" mr={10}>
                                    Edit
                                </Link>
                                <Link color="red.500">Delete</Link>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <AddUserModal isOpen={isAddUserOpen} onClose={onAddUserClose} onUserAdded={loadUsers} />
        </Box>
    );
}
