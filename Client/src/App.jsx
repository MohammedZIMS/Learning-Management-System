import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Import createBrowserRouter
import MainLayout from './layout/MainLayout';
import Login from './page/Login';
import HeroSection from './page/student/HeroSection';

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
            {/* <Course /> */} {/* Placeholder for future course component */}
          </>
        ),
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />; // No unnecessary wrappers
}

export default App;
