"use client";

import { Box } from "@chakra-ui/react";
import Navbar from "./components/navbar";
import ItemTable from "./components/ItemTable";
import withAuth from "./components/withAuth";  // Import the HOC

function ItemPage() {
  return (
    <>
      <Navbar />
      <Box textAlign="center" py={10} px={6}>
        <ItemTable />
      </Box>
    </>
  );
}

export default withAuth(ItemPage);  // Wrap the component with withAuth