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
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Item, sendReport } from "../lib/items";  // Import the sendReport function

interface SendReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: Item | null;
}

export default function SendReportModal({ isOpen, onClose, item }: SendReportModalProps) {
    const [emails, setEmails] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSendEmails = async () => {
        if (!item) return;

        setIsLoading(true);

        try {
            const response = await sendReport(item.name, item.quantity, emails);
            toast({
                title: "Report sent.",
                description: `Sent to ${response.sentCount} emails. Failed emails: ${response.failedEmails.join(', ')}`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            console.error("Error sending report:", error);
            toast({
                title: "Error",
                description: "There was an error sending the report.",
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
                <ModalHeader>Send Report to Merchants</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="item-name">
                        <FormLabel>Item Name</FormLabel>
                        <Input value={item?.name} isReadOnly />
                    </FormControl>
                    <FormControl id="quantity" mt={4}>
                        <FormLabel>Quantity</FormLabel>
                        <Input value={item?.quantity.toString()} isReadOnly />
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
                    <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        backgroundColor="#0052ea"
                        color="white"
                        _hover={{ backgroundColor: "#003bb5" }}
                        onClick={handleSendEmails}
                        ml={3}
                        isLoading={isLoading}
                    >
                        Send Emails
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
