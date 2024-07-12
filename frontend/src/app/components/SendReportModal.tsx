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
    Textarea,
} from "@chakra-ui/react";
import { useState } from "react";

interface SendReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: { name: string; quantity: string } | null;
}

export default function SendReportModal({ isOpen, onClose, item }: SendReportModalProps) {
    const [emails, setEmails] = useState("");

    const handleSendEmails = () => {
        // Logic to handle sending the emails
        console.log("Report sent:", { item, emails });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Send Report to Merchants</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="item-name">
                        <FormLabel>Item Name</FormLabel>
                        <Input value={item?.name} isReadOnly />
                    </FormControl>
                    <FormControl id="quantity" mt={4}>
                        <FormLabel>Quantity</FormLabel>
                        <Input value={item?.quantity} isReadOnly />
                    </FormControl>
                    <FormControl id="emails" mt={4}>
                        <FormLabel>Email&apos;s of the Merchants (separate with a comma)</FormLabel>
                        <Textarea
                            placeholder="Emails"
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
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
                        onClick={handleSendEmails}
                        ml={3}
                    >
                        Send Emails
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
