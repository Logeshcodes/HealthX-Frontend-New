import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface doctor {
    name: string | null,
    email: string | null,
    role: string | null,
    profilePicture: string | null
}

// Initialize state
const initialState: doctor = {
    name: null,
    email: null,
    role: null,
    profilePicture:null
};

const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        setDoctor: (state, action: PayloadAction<doctor>) => {
             const {  name, email, role ,profilePicture} = action.payload;
           
                state.name = name,
                state.email = email,
                state.role = role
                state.profilePicture=profilePicture

            if (typeof window !== 'undefined') {
                localStorage.setItem('doctor', JSON.stringify(state));
            }
        },

        clearDoctorDetials: (state) => {
          
            state.name = null
            state.email = null
            state.role = null
            state.profilePicture=null

            if (typeof window !== 'undefined') {
                localStorage.removeItem('doctor');
            }
        }
    }
})

export const { setDoctor, clearDoctorDetials } = doctorSlice.actions
export default doctorSlice.reducer