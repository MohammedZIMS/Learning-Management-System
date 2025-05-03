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
import EditLecture from './page/admin/lectures/EditLecture';

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
        element: <Login/>,
      },
      {
        path: 'my-learning',
        element: <MyLearning/>,
      },
      {
        path: 'profile',
        element: <Profile/>,
      },
      {
        path: 'course',
        element: <Courses/>,
      },
      {
        path: 'dashboard',
        element: <Sidebar />,
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
            path: 'instructor-course/:courseId/lecture-module',
            element: <CreateLectureModule/>,
          },
          {
            path: 'instructor-course/:courseId/lecture-module/:moduleId/lecture',
            element: <CreateLecture/>,
          },
          {
            path: 'courses/:courseId/modules/:moduleId/lectures/:lectureId',
            element: <EditLecture />,
          },
          
        ]
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
