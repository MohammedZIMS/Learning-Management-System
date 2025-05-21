import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API URL for all course-related operations
const COURSE_API = "http://localhost:8081/api/v1/course";

// Define the RTK Query API slice
export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture", "Lecture"],
  // Base query function to handle requests
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include", // Ensures cookies are sent with requests
  }),
  endpoints: (builder) => ({

    // Mutation to create a new course
    createCourse: builder.mutation({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getSearchCourse: builder.query({
      query: ({ searchQuery, categories, sortByPrice }) => {
        // Build qiery string
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;

        // append cateogry 
        if (categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`;
        }

        // Append sortByPrice is available
        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }

        return {
          url: queryString,
          method: "GET",
        }
      }
    }),

    // Query to fetch all published courses
    getPublishedCourses: builder.query({
      query: () => ({
        url: "/published-courses",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    // Query to fetch all courses created by the logged-in user
    getCreatorCourses: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    // Query to fetch a specific course by its ID
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    // Mutation to edit an existing course
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    // Mutation to create a new lecture module within a course
    createLectureModule: builder.mutation({
      query: ({ title, courseId }) => ({
        url: `/${courseId}/modules`,
        method: "POST",
        body: { title }
      }),
    }),

    // Query to fetch all lecture modules for a specific course
    getCouseLectureModule: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/modules`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    // Mutation to create a new lecture within a specific module of a course
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId, moduleId }) => ({
        url: `/${courseId}/modules/${moduleId}/lectures`,
        method: "POST",
        body: {
          lectureTitle,
          courseId,
          moduleId
        }
      }),
      invalidatesTags: ["Lecture"],
    }),

    // Query to fetch all lectures within a specific module of a course
    getLecturesByModule: builder.query({
      query: ({ courseId, moduleId }) => ({
        url: `/${courseId}/modules/${moduleId}/lectures`,
        method: "GET",
      }),
      providesTags: ["Lecture", "Refetch_Lecture", "Refetch_Creator_Course"],
    }),


    // Mutation to edit an existing lecture
    editLecture: builder.mutation({
      query: ({ lectureTitle, videoInfo, isPreviewFree, courseId, moduleId, lectureId }) => ({
        url: `/${courseId}/modules/${moduleId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Creator_Course", "Refetch_Lecture"],
    }),

    getLectureById: builder.query({
      query: ({ lectureId }) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      }),
    }),

    publishCourse: builder.mutation({
      query: ({ courseId, isPublished }) => ({
        url: `/${courseId}?isPublished=${isPublished}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

  }),
});

// Export hooks correctly
export const {
  useCreateCourseMutation,
  useGetSearchCourseQuery,
  useGetPublishedCoursesQuery,
  useGetCreatorCoursesQuery,
  useGetCourseByIdQuery,
  useEditCourseMutation,
  useCreateLectureModuleMutation,
  useGetCouseLectureModuleQuery,
  useCreateLectureMutation,
  useGetLecturesByModuleQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
} = courseApi;
