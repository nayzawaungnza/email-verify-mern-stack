import {create} from 'zustand';
import axios from 'axios';

const API_URL = 'https://email-verify-mern-stack-pw3s.vercel.app/api/auth';

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user:null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async ({name, email, password} ) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/signup`, {email, password, name});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({error: error.response.data.message || 'Error Signing Up.', isLoading: false});
            throw error;
        }
    },
    login: async ({email, password}) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/signin`, {email, password});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },
    logout: async () => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/logout`);
            set({user: null, isAuthenticated: false, isLoading: false});
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
			throw error;
        }
    },

    verifyEmail: async ( code) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/verify-email`, {code});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({error: error.response.data.message || 'Error Email Verify.', isLoading: false});
            throw error;
        }
    },
    verifyAuth: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/verify-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
    },

    forgotPassword: async (email) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, {email});
            set({message: response.data.message, isLoading: false});
        } catch (error) {
            set({ error: error.response.data.message || 'Error Email Verify.', isLoading: false});
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password});
            set({message: response.data.message, isLoading: false});
        } catch (error) {
            set({ error: error.response.data.message || 'Error Email Verify.', isLoading: false});
            throw error;
        }
    },

    updateProfile: async (id, data) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/update-profile/${id}`, data);
            set({user: response.data.user, isLoading: false});
        } catch (error) {
            set({ error: error.response.data.message || 'Error Email Verify.', isLoading: false});
            throw error;
        }
    }
    

}));