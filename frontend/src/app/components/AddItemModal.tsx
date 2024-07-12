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
    FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { addItem } from '../lib/items';  // Import the addItem function

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [itemNameError, setItemNameError] = useState("");
    const [quantityError, setQuantityError] = useState("");
    const toast = useToast();

    const validateInputs = () => {
        let isValid = true;
        if (!itemName) {
            setItemNameError("Item name is required.");
            isValid = false;
        } else {
            setItemNameError("");
        }

        if (!quantity) {
            setQuantityError("Quantity is required.");
            isValid = false;
        } else if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
            setQuantityError("Quantity must be a positive number.");
            isValid = false;
        } else {
            setQuantityError("");
        }

        return isValid;
    };

    const handleAddItem = async () => {
        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        try {
            const newItem = await addItem(itemName, parseInt(quantity, 10));

            toast({
                title: "Item added.",
                description: `Item ${newItem.name} added successfully.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            setItemName("");
            setQuantity("");
            onClose();
        } catch (error) {
            console.error("Error adding item:", error);
            toast({
                title: "Error",
                description: "There was an error adding the item.",
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
                <ModalHeader>Add Item</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="item-name" isRequired isInvalid={!!itemNameError}>
                        <FormLabel>Item Name</FormLabel>
                        <Input
                            placeholder="Item Name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                        {itemNameError && <FormErrorMessage>{itemNameError}</FormErrorMessage>}
                    </FormControl>
                    <FormControl id="quantity" isRequired mt={4} isInvalid={!!quantityError}>
                        <FormLabel>Quantity</FormLabel>
                        <Input
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            type="number"
                        />
                        {quantityError && <FormErrorMessage>{quantityError}</FormErrorMessage>}
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
                        onClick={handleAddItem}
                        ml={3}
                        isLoading={isLoading}
                        isDisabled={!itemName || !quantity || !!itemNameError || !!quantityError}
                    >
                        Add Item
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
