import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8081/api/v1/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include", // Ensures cookies are sent with requests
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getCreatorCourses: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    getCourseById: builder.query({  
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    createLectureModule: builder.mutation({
      query: ({title, courseId}) => ({
        url: `/${courseId}/lecture-module`,
        method: "POST",
        body: {title}
      }),
    }),

    getCouseLectureModule: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture-module`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

  }),
});

// Export hooks correctly
export const { 
  useCreateCourseMutation, 
  useGetCreatorCoursesQuery, 
  useGetCourseByIdQuery,  
  useEditCourseMutation,
  useCreateLectureModuleMutation,
  useGetCouseLectureModuleQuery
} = courseApi;
