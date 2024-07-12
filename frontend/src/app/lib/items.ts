import axios from 'axios';
import Cookies from 'js-cookie';

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

export const addItem = async (name: string, quantity: number): Promise<Item> => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await axios.post<Item>(
            `${API_URL}/items`,
            {
                name,
                quantity,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
};

export const updateItem = async (id: number, name: string, quantity: number): Promise<Item> => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await axios.patch<Item>(
            `${API_URL}/items/${id}`,
            {
                name,
                quantity,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

export const deleteItem = async (id: number): Promise<void> => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        await axios.delete(`${API_URL}/items/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

export const sendReport = async (itemName: string, quantity: number, emails: string): Promise<{ sentCount: number, failedEmails: string[] }> => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await axios.post<{ sentCount: number, failedEmails: string[] }>(
            `${API_URL}/email/send-inventory-report`,
            {
                itemName,
                quantity,
                emails
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending report:', error);
        throw error;
    }
};
