import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Link, useDisclosure, Spinner, Text, useToast } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import SendReportModal from "./SendReportModal";
import { fetchItems, deleteItem, Item } from "../lib/items";
import { UserRole } from '../../../types/users.types';

export default function ItemTable() {
    const { isOpen: isAddItemOpen, onOpen: onAddItemOpen, onClose: onAddItemClose } = useDisclosure();
    const { isOpen: isEditItemOpen, onOpen: onEditItemOpen, onClose: onEditItemClose } = useDisclosure();
    const { isOpen: isSendReportOpen, onOpen: onSendReportOpen, onClose: onSendReportClose } = useDisclosure();
    const [itemList, setItemList] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(UserRole.VIEWER);
    const toast = useToast();

    const fetchAndSetItems = async () => {
        try {
            setIsLoading(true);
            const items = await fetchItems();
            setItemList(items);
            setError(null);
        } catch (err) {
            setError('Failed to fetch items');
            console.error('Error fetching items:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            setUserRole(user.role as UserRole);
        }

        fetchAndSetItems();
    }, []);

    const handleSendReportClick = (item: Item) => {
        setSelectedItem(item);
        onSendReportOpen();
    };

    const handleEditItemClick = (item: Item) => {
        setSelectedItem(item);
        onEditItemOpen();
    };

    const handleDeleteItemClick = async (id: number) => {
        try {
            await deleteItem(id);
            toast({
                title: "Item deleted.",
                description: `Item with ID ${id} has been deleted.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            fetchAndSetItems(); 
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an error deleting the item.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const canEdit = userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;

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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontSize="lg" fontWeight="bold">
                    Your role: {userRole}
                </Text>
                {canEdit && (
                    <Button
                        backgroundColor="#0052ea"
                        color="white"
                        _hover={{ backgroundColor: "#003bb5" }}
                        onClick={onAddItemOpen}
                    >
                        Add Item
                    </Button>
                )}
            </Box>
            <Table variant="simple" className="table-auto w-full">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Item Name</Th>
                        <Th>Quantity</Th>
                        {canEdit && <Th>Actions</Th>}
                    </Tr>
                </Thead>
                <Tbody>
                    {itemList.map((item) => (
                        <Tr key={item.id}>
                            <Td>{item.id}</Td>
                            <Td>{item.name}</Td>
                            <Td>{item.quantity}</Td>
                            {canEdit && (
                                <Td>
                                    <Link color="blue.500" mr={10} onClick={() => handleSendReportClick(item)}>
                                        Send Report
                                    </Link>
                                    <Link color="blue.500" mr={10} onClick={() => handleEditItemClick(item)}>
                                        Edit
                                    </Link>
                                    <Link color="red.500" onClick={() => handleDeleteItemClick(item.id)}>
                                        Delete
                                    </Link>
                                </Td>
                            )}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {canEdit && (
                <>
                    <AddItemModal isOpen={isAddItemOpen} onClose={() => { onAddItemClose(); fetchAndSetItems(); }} />
                    <EditItemModal isOpen={isEditItemOpen} onClose={() => { onEditItemClose(); fetchAndSetItems(); }} item={selectedItem} />
                    <SendReportModal isOpen={isSendReportOpen} onClose={onSendReportClose} item={selectedItem} />
                </>
            )}
        </Box>
    );
}
