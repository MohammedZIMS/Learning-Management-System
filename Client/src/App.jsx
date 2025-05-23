import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Login from './page/Login';
import HeroSection from './page/student/HeroSection';
import Courses from './page/student/Courses';
import MyLearning from './page/student/MyLearning';
import Profile from './page/student/Profile';
import Sidebar from './page/Dashboard/Sidebar';
import InstructorDashboard from './page/Dashboard/InstructorDashboard';
import CourseTable from './page/admin/course/CourseTable';
import AddCourse from './page/admin/course/AddCourse';
import EditCourse from './page/admin/course/EditCourse';
import CreateLectureModule from './page/admin/lectures/CreateLectureModule';
import CreateLecture from './page/admin/lectures/CreateLecture';
import EditLecture from './page/admin/lectures/EditLecture';
import CourseDetail from './page/student/CourseDetail';
import CourseProgress from './page/student/courseProgress';
import SearchPage from './page/student/SearchPage';
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoutes';
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute';
import { ThemeProvider } from './components/ThemeProvider';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <>
            <HeroSection />
            <Courses/>
          </>
        ),
      },
      {
        path: 'login',
        element: <AuthenticatedUser><Login/></AuthenticatedUser> ,
      },
      {
        path: 'my-learning',
        element: <ProtectedRoute><MyLearning/></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile/></ProtectedRoute>,
      },
      {
        path: 'course/search',
        element: <ProtectedRoute><SearchPage/></ProtectedRoute>,
      },
      {
        path: 'course',
        element: <Courses/>,
      },
      {
        path: 'course-detail/:courseId',
        element: <ProtectedRoute><CourseDetail/></ProtectedRoute>,
      },
      {
        path: 'course-progress/:courseId',
        element: (
        <ProtectedRoute>
          {/* <PurchaseCourseProtectedRoute> */}
            <CourseProgress/>
          {/* </PurchaseCourseProtectedRoute> */}
        </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
        // <AdminRoute>
          <Sidebar/>
        // </AdminRoute>
        ),
        children: [
          {
            path: 'instructor-dashboard',
            element: <InstructorDashboard />,
          },
          {
            path: 'instructor-course',
            element: <CourseTable/>,
          },
          {
            path: 'instructor-course/create-course',
            element: <AddCourse/>,
          },
          {
            path: 'instructor-course/:courseId',
            element: <EditCourse/>,
          },
          {
            path: 'instructor-course/:courseId/modules',
            element: <CreateLectureModule/>,
          },
          {
            path: 'instructor-course/:courseId/modules/:moduleId/lecture',
            element: <CreateLecture/>,
          },
          {
            path: 'courses/:courseId/modules/:moduleId/lecture/:lectureId',
            element: <EditLecture />,
          },    
        ]
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
);
}

export default App;
