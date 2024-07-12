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
} from "@chakra-ui/react";
import { useState } from "react";

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleAddItem = () => {
        // Logic to handle adding the item
        console.log("Item added:", { itemName, quantity });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Item</ModalHeader>
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
                        onClick={handleAddItem}
                        ml={3}
                    >
                        Add Item
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
