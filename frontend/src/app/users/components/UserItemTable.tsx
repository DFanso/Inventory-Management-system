import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Link, useDisclosure } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import AddUserModal from "./AddUserModal";

interface Item {
    id: number;
    name: string;
    userId: string;
    role: string;
    isActive: string;
}

const items: Item[] = [
    { id: 1, name: "Corey Curtis", userId: "0001", role: "Manager", isActive: "True" },
    { id: 2, name: "Alfonso Stanton", userId: "0002", role: "Viewer", isActive: "False" },
    { id: 3, name: "Justin Aminoff", userId: "0003", role: "Manager", isActive: "False" },
    { id: 4, name: "Leo Geidt", userId: "0004", role: "Admin", isActive: "True" },
    { id: 5, name: "Jaydon Workman", userId: "0005", role: "Manager", isActive: "True" },
    { id: 6, name: "Buben Levin", userId: "0006", role: "Manager", isActive: "False" },
    { id: 7, name: "Omar Passaquindici Arcand", userId: "0007", role: "Manager", isActive: "True" },
    { id: 8, name: "Phillip Mango", userId: "0008", role: "Manager", isActive: "False" },
    { id: 9, name: "Martin Workman", userId: "0009", role: "Admin", isActive: "True" },
    { id: 10, name: "Ruben Dokidis", userId: "0010", role: "Manager", isActive: "True" },
    { id: 11, name: "Ruben Dokidis", userId: "0011", role: "Admin", isActive: "False" }
];

export default function ItemTable() {
    const { isOpen: isAddItemOpen, onOpen: onAddItemOpen, onClose: onAddItemClose } = useDisclosure();
    const [itemList] = useState<Item[]>(items);

    return (
        <Box className="max-w-6xl mx-auto">
            <Box className="flex justify-end items-center mb-4">
                <Button
                    backgroundColor="#0052ea"
                    color="white"
                    _hover={{ backgroundColor: "#003bb5" }}
                    onClick={onAddItemOpen}
                >
                    Add Users
                </Button>
            </Box>
            <Table variant="simple" className="table-auto w-full">
                <Thead>
                    <Tr>
                        <Th>
                            Display Name <ChevronUpIcon /> <ChevronDownIcon />
                        </Th>
                        <Th>
                            User ID <ChevronUpIcon /> <ChevronDownIcon />
                        </Th>
                        <Th>
                            Role <ChevronUpIcon /> <ChevronDownIcon />
                        </Th>
                        <Th>
                            Is Active <ChevronUpIcon /> <ChevronDownIcon />
                        </Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {itemList.map((item) => (
                        <Tr key={item.id}>
                            <Td>{item.name}</Td>
                            <Td>{item.userId}</Td>
                            <Td>{item.role}</Td>
                            <Td>{item.isActive}</Td>
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
            <AddUserModal isOpen={isAddItemOpen} onClose={onAddItemClose} />
        </Box>
    );
}
