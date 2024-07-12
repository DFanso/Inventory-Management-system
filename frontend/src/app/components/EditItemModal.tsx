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
    useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Item, updateItem } from '../lib/items';  // Import the updateItem function

interface EditItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: Item | null;
}

export default function EditItemModal({ isOpen, onClose, item }: EditItemModalProps) {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (item) {
            setItemName(item.name);
            setQuantity(item.quantity.toString());
        }
    }, [item]);

    const handleEditItem = async () => {
        if (!item) return;
        setIsLoading(true);
        try {
            const updatedItem = await updateItem(item.id, itemName, parseInt(quantity, 10));

            toast({
                title: "Item updated.",
                description: `Item ${updatedItem.name} updated successfully.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            onClose();
        } catch (error) {
            console.error("Error updating item:", error);
            toast({
                title: "Error",
                description: "There was an error updating the item.",
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
                <ModalHeader>Edit Item</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="item-name" isRequired>
                        <FormLabel>Item Name</FormLabel>
                        <Input
                            placeholder="Item Name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="quantity" isRequired mt={4}>
                        <FormLabel>Quantity</FormLabel>
                        <Input
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            type="number"
                        />
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
                        onClick={handleEditItem}
                        ml={3}
                        isLoading={isLoading}
                    >
                        Update Item
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
