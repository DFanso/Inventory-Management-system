import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Link, useDisclosure } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import AddItemModal from "./AddItemModal";
import SendReportModal from "./SendReportModal";

const items = [
    { id: 1, name: "Corey Curtis", quantity: "0001" },
    { id: 2, name: "Alfonso Stanton", quantity: "0002" },
    { id: 3, name: "Justin Aminoff", quantity: "0003" },
    { id: 4, name: "Leo Geidt", quantity: "0004" },
    { id: 5, name: "Jaydon Workman", quantity: "0005" },
    { id: 6, name: "Buben Levin", quantity: "0006" },
    { id: 7, name: "Omar Passaquindici Arcand", quantity: "0007" },
    { id: 8, name: "Phillip Mango", quantity: "0008" },
    { id: 9, name: "Martin Workman", quantity: "0009" },
    { id: 10, name: "Ruben Dokidis", quantity: "0010" },
    { id: 11, name: "Ruben Dokidis", quantity: "0011" }
];

export default function ItemTable() {
    const { isOpen: isAddItemOpen, onOpen: onAddItemOpen, onClose: onAddItemClose } = useDisclosure();
    const { isOpen: isSendReportOpen, onOpen: onSendReportOpen, onClose: onSendReportClose } = useDisclosure();
    const [itemList] = useState(items);
    const [selectedItem, setSelectedItem] = useState<{ name: string; quantity: string } | null>(null);

    const handleSendReportClick = (item: { name: string; quantity: string }) => {
        setSelectedItem(item);
        onSendReportOpen();
    };

    return (
        <Box className="max-w-6xl mx-auto">
            <Box className="flex justify-end items-center mb-4">
                <Button
                    backgroundColor="#0052ea"
                    color="white"
                    _hover={{ backgroundColor: "#003bb5" }}
                    onClick={onAddItemOpen}
                >
                    Add Item
                </Button>
            </Box>
            <Table variant="simple" className="table-auto w-full">
                <Thead>
                    <Tr>
                        <Th>
                            Item Name <ChevronUpIcon /> <ChevronDownIcon />
                        </Th>
                        <Th>
                            Quantity <ChevronUpIcon /> <ChevronDownIcon />
                        </Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {itemList.map((item) => (
                        <Tr key={item.id}>
                            <Td>{item.name}</Td>
                            <Td>{item.quantity}</Td>
                            <Td>
                                <Link color="blue.500" mr={10} onClick={() => handleSendReportClick(item)}>
                                    Send Report
                                </Link>
                                <Link color="blue.500" mr={10}>
                                    Edit
                                </Link>
                                <Link color="red.500">Delete</Link>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <AddItemModal isOpen={isAddItemOpen} onClose={onAddItemClose} />
            <SendReportModal isOpen={isSendReportOpen} onClose={onSendReportClose} item={selectedItem} />
        </Box>
    );
}
