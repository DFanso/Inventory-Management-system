import { Box, Flex, Button, Text } from "@chakra-ui/react";
import Link from "next/link";

const Navbar = () => {
    return (
        <Box as="nav" bg="white" borderBottom="1px" borderColor="gray.200" px={4} py={4}>
            <Flex justify="space-between" align="center">
                <Link href="/" passHref>
                    <Text fontSize="lg" fontWeight="bold" cursor="pointer">
                        Inventory Management System
                    </Text>
                </Link>
                <Button
                    backgroundColor="#0052ea"
                    color="white"
                    _hover={{ backgroundColor: "#003bb5" }}
                >
                    Manage Users
                </Button>
            </Flex>
        </Box>
    );
};

export default Navbar;
