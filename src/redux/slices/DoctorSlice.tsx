import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface doctor {
    userId: string | null,
    name: string | null,
    email: string | null,
    role: string | null,
    isBlocked: string | null,
    profilePicture: string | null
}

// Initialize state
const initialState: doctor = {
    userId: null,
    name: null,
    email: null,
    role: null,
    isBlocked: null,
    profilePicture:null
};

const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        setDoctor: (state, action: PayloadAction<doctor>) => {
             const { userId ,  name, email, role, isBlocked ,profilePicture} = action.payload;
           
                state.userId = userId,
                state.name = name,
                state.email = email,
                state.role = role,
                state.isBlocked = isBlocked,
                state.profilePicture=profilePicture

            if (typeof window !== 'undefined') {
                localStorage.setItem('doctor', JSON.stringify(state));
            }
        },

        clearDoctorDetials: (state) => {
          
            state.userId = null
            state.name = null
            state.email = null
            state.role = null
            state.isBlocked = null
            state.profilePicture=null

            if (typeof window !== 'undefined') {
                localStorage.removeItem('doctor');
            }
        }
    }
})

export const { setDoctor, clearDoctorDetials } = doctorSlice.actions
export default doctorSlice.reducer