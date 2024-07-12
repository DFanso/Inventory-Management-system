import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Link, useDisclosure, Spinner, Text, Select, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import { fetchUsers, updateUserStatus, deleteUser, User } from "../../lib/users"; 

export default function UserItemTable() {
    const { isOpen: isAddUserOpen, onOpen: onAddUserOpen, onClose: onAddUserClose } = useDisclosure();
    const { isOpen: isEditUserOpen, onOpen: onEditUserOpen, onClose: onEditUserClose } = useDisclosure();
    const [userList, setUserList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const toast = useToast();

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

    const handleEditUserOpen = (user: User) => {
        setSelectedUser(user);
        onEditUserOpen();
    };

    const handleDeleteUser = async (userId: number) => {
        setIsLoading(true);
        try {
            await deleteUser(userId);
            toast({
                title: "User deleted.",
                description: "The user has been deleted successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast({
                title: "Error",
                description: "There was an error deleting the user.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
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
                        <Th>Email</Th>
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
                            <Td>{user.email}</Td>
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
                                <Link color="blue.500" mr={10} onClick={() => handleEditUserOpen(user)}>
                                    Edit
                                </Link>
                                <Link color="red.500" onClick={() => handleDeleteUser(user.id)}>Delete</Link>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <AddUserModal isOpen={isAddUserOpen} onClose={onAddUserClose} onUserAdded={loadUsers} />
            {selectedUser && (
                <EditUserModal
                    isOpen={isEditUserOpen}
                    onClose={onEditUserClose}
                    onUserUpdated={loadUsers}
                    user={selectedUser}
                />
            )}
        </Box>
    );
}
