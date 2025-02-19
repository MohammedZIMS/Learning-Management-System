import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8081/api/v1/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include", // Ensures cookies are sent with requests
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),

    }),
    // Other endpoints can be added here...
    getCreatorCourses: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
  }),
});

// Export the correctly named hook.
export const { useCreateCourseMutation, useGetCreatorCoursesQuery } = courseApi;
