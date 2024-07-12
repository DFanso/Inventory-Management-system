"use client";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/navbar";
import ItemTable from "./components/UserItemTable";
import withAuth from "../components/withAuth"; 

function UserPage() {
    return (
        <>
            <Navbar />
            <Box textAlign="center" py={10} px={6}>
                <ItemTable />
            </Box>
        </>
    );
}

export default withAuth(UserPage, ['ADMIN']); 
