import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "http://localhost:8081/api/v1/purchase";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_PURCHASE_API,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        // Route to create a checkout session
        createCheckoutSession: builder.mutation({
            query: (courseData) => ({
                url: "/checkout/create-checkout-session",
                method: "POST",
                body: {
                    courseId: courseData.courseId,
                    courseName: courseData.courseName,
                    amount: courseData.amount
                },
            }),
        }),

        // Route to handle Stripe webhook events
        stripeWebhook: builder.mutation({
            query: () => ({
                url: "/webhook",
                method: "POST",
            }),
        }),

        // Route to get course details with purchase status
        getCourseDetailsWithPurchaseStatus: builder.query({
            query: (courseId) => ({
                url: `/course/${courseId}/detail-with-status`,
                method: "GET",
            }),
        }),

        // Route to get all purchased courses
        getAllPurchasedCourses: builder.query({
            query: () => ({
                url: "/",
                method: "GET",
            }),
        }),
    }),
})

export const {
    useCreateCheckoutSessionMutation,
    useStripeWebhookMutation,
    useGetCourseDetailsWithPurchaseStatusQuery,
    useGetAllPurchasedCoursesQuery,
} = purchaseApi;
