import { Box, Heading, Text } from "@chakra-ui/react";
import Navbar from "../components/navbar";

export default function UnauthorizedPage() {
    return (
        <>
            <Navbar />
            <Box textAlign="center" py={10} px={6}>
                <Heading>Unauthorized</Heading>
                <Text>You do not have permission to view this page.</Text>
            </Box>
        </>
    );
}
