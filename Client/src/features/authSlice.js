// Importing the `createSlice` function from Redux Toolkit to create a slice of state.
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the authentication slice.
// `user` is set to `null` initially, meaning no user is logged in.
// `isAuthenticated` is `false`, indicating the user is not authenticated.
const initialState = {
    user: null,
    isAuthenticated: false
};

// Creating the `authSlice` using `createSlice` from Redux Toolkit.
// This slice will manage authentication-related state and actions.
const authSlice = createSlice({
    name: "authSlice", // Name of the slice, used internally in Redux.
    initialState,      // Setting the initial state.
    reducers: {       // Defining reducer functions that modify the state.
        
        // Action: `userLoggedIn`
        // This function is triggered when a user logs in.
        // It updates the `user` state with the provided user data
        // and sets `isAuthenticated` to `true`.
        userLoggedIn: (state, action) => {
            state.user = action.payload.user;  // Storing the user details.
            state.isAuthenticated = true;      // Marking the user as authenticated.
        },

        // Action: `userLoggedOut`
        // This function is triggered when a user logs out.
        // It resets the `user` state to `null` and sets `isAuthenticated` to `false`.
        userLoggedOut: (state) => {
            state.user = null;            // Removing user details.
            state.isAuthenticated = false; // Marking the user as not authenticated.
        }
    },
});

// Exporting the actions so they can be used throughout the application.
// `userLoggedIn` and `userLoggedOut` can be dispatched from components.
export const { userLoggedIn, userLoggedOut } = authSlice.actions;

// Exporting the reducer function so it can be added to the Redux store.
export default authSlice.reducer;
