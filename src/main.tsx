import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/000--Home/Home.tsx'
import NewHarvest from './pages/050--NewHarvest/NewHarvest.tsx'
import ProtectedRoute from './Components/ProtectedRoute.tsx'
import { AuthProvider } from './Contexts/AuthContext.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
         </ProtectedRoute>
        )
         ,
      },
      {
        path: "nueva-cosecha",
        element: (
          <ProtectedRoute>
            <NewHarvest />
         </ProtectedRoute>
        )
      }
    ]
  },


]) 





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
