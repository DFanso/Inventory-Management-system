import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface Item {
    id: number;
    name: string;
    quantity: number;
}

export const fetchItems = async (): Promise<Item[]> => {
    try {
        const response = await axios.get<Item[]>(`${API_URL}/items`);
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};
