import axios from 'axios';
import { UserRole } from '../../../types/users.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface LoginResponse {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole
    };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${API_URL}/auth/sign-in`, { email, password });
        
        localStorage.setItem('user', JSON.stringify(response.data.user));


        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};