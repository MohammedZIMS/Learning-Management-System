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
        path: 'course/search',
        element: <SearchPage/>,
      },
      {
        path: 'course',
        element: <Courses/>,
      },
      {
        path: 'course-detail/:courseId',
        element: <CourseDetail/>,
      },
      {
        path: 'course-progress/:courseId',
        element: <CourseProgress/>,
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
  return <RouterProvider router={appRouter} />;
}

export default App;
