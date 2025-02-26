import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface User {
   
    userId: string | null,
    name: string | null,
    email: string | null,
    role: string | null,
    isBlocked: string | null,
    profilePicture: string | null
}

// Initialize state
const initialState: User = {
   
    userId: null,
    name: null,
    email: null,
    role: null,
    isBlocked: null,
    profilePicture:null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            const { userId , name, email, role , isBlocked ,profilePicture} = action.payload;
            
                state.userId = userId,
                state.name = name,
                state.email = email,
                state.role = role,
                state.isBlocked = isBlocked,
                state.profilePicture=profilePicture

            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(state));
            }
        },

        clearUserDetails: (state) => {
           
            state.userId = null
            state.name = null
            state.email = null
            state.role = null
            state.isBlocked = null
            state.profilePicture=null

            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
            }
        }
    }
})

export const { setUser, clearUserDetails } = userSlice.actions
export default userSlice.reducer