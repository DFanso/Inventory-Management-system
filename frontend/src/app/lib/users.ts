import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface User {
    id: number;
    name: string;
    userId: string;
    role: string;
    isActive: boolean;
}

export const fetchUsers = async (): Promise<User[]> => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await axios.get<User[]>(`${API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


export const addUser = async (name: string, email: string, password: string, role: string): Promise<User> => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await axios.post<User>(
            `${API_URL}/users`,
            { name, email, password, role },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

export const updateUserStatus = async (userId: number, status: boolean): Promise<void> => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        await axios.patch(
            `${API_URL}/users/${userId}/status/${status}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
    }
};
