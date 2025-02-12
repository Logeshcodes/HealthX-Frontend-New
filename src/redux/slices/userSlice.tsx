import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface User {
   
    name: string | null,
    email: string | null,
    role: string | null,
    profilePicture: string | null
}

// Initialize state
const initialState: User = {
   
    name: null,
    email: null,
    role: null,
    profilePicture:null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            const {  name, email, role ,profilePicture} = action.payload;
            
                state.name = name,
                state.email = email,
                state.role = role
                state.profilePicture=profilePicture

            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(state));
            }
        },

        clearUserDetials: (state) => {
           
            state.name = null
            state.email = null
            state.role = null
            state.profilePicture=null

            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
            }
        }
    }
})

export const { setUser, clearUserDetials } = userSlice.actions
export default userSlice.reducer