'use client';

import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";

type ProvidersProps = {
    children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
    return <ChakraProvider>{children}</ChakraProvider>;
}
