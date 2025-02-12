import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import { combineReducers } from 'redux';

import userReducer from './slices/userSlice';
import doctorReducer from './slices/DoctorSlice';

// Configure persistence
const userPersistConfig = { key: 'user', storage };
const doctorPersistConfig = { key: 'doctor', storage };

// Combine reducers (for scalability)
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  doctor: persistReducer(doctorPersistConfig, doctorReducer)
});

// Create store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


// Types for store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;