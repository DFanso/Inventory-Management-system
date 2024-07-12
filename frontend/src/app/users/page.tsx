"use client";
import { Box, Heading, Text } from "@chakra-ui/react";
import Navbar from "../components/navbar";
import ItemTable from "./components/UserItemTable";

export default function ItemPage() {
    return (
        <>
            <Navbar />
            <Box textAlign="center" py={10} px={6}>
                <ItemTable />
            </Box>
        </>
    );
}
