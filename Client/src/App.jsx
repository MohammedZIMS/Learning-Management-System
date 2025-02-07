import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Import createBrowserRouter
import MainLayout from './layout/MainLayout';
import Login from './page/Login';
import HeroSection from './page/student/HeroSection';
import Courses from './page/student/Courses';
import MyLearning from './page/student/MyLearning';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // Ensures MainLayout wraps child routes
    children: [
      {
        path: '/',
        element: (
          <>
            <HeroSection />
            <Courses/> {/* Placeholder for future course component */}
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
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />; // No unnecessary wrappers
}

export default App;
