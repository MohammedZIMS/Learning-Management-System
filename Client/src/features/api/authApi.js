import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../authSlice";

const USER_API = "http://localhost:8081/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include", // Ensures cookies are sent with requests
    mode: "cors", // Explicitly setting CORS mode
  }),

  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
        headers: {
          "Content-Type": "application/json", // Ensure proper JSON content
        },
      }),
    }),

    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
        headers: {
          "Content-Type": "application/json",
        },
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(userLoggedIn({ user: data.user })); // Ensure `user` exists before dispatching
          }
        } catch (error) {
          console.error("Login failed:", error); // Improved error logging
        }
      },
    }),

    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET"
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      }
    })
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useLoadUserQuery } = authApi;
