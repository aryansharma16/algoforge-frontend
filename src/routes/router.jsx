import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AuthLayout from '../layouts/AuthLayout'
import AppLayout from '../layouts/AppLayout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Journeys from '../pages/Journeys'
import CreateJourney from '../pages/CreateJourney'
import EditJourney from '../pages/EditJourney'
import JourneyDetails from '../pages/JourneyDetails'
import ItemDetails from '../pages/ItemDetails'
import CreateItem from '../pages/CreateItem'
import EditItem from '../pages/EditItem'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import About from '../pages/About'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsOfService from '../pages/TermsOfService'

function RequireAuth() {
  const token = useSelector((s) => s.auth.token)
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

function GuestOnly() {
  const token = useSelector((s) => s.auth.token)
  if (token) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export default function Router() {
  return useRoutes([
    { path: '/privacy-policy', element: <PrivacyPolicy /> },
    { path: '/terms', element: <TermsOfService /> },
    {
      path: '/login',
      element: <GuestOnly />,
      children: [
        {
          element: <AuthLayout />,
          children: [{ index: true, element: <Login /> }],
        },
      ],
    },
    {
      path: '/register',
      element: <GuestOnly />,
      children: [
        {
          element: <AuthLayout />,
          children: [{ index: true, element: <Register /> }],
        },
      ],
    },
    {
      path: '/',
      element: <RequireAuth />,
      children: [
        {
          element: <AppLayout />,
          children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'journeys', element: <Journeys /> },
            { path: 'journeys/new', element: <CreateJourney /> },
            { path: 'journeys/:journeyId/edit', element: <EditJourney /> },
            { path: 'journeys/:journeyId', element: <JourneyDetails /> },
            { path: 'journeys/:journeyId/items/new', element: <CreateItem /> },
            {
              path: 'journeys/:journeyId/items/:itemId/edit',
              element: <EditItem />,
            },
            {
              path: 'journeys/:journeyId/items/:itemId',
              element: <ItemDetails />,
            },
            { path: 'settings', element: <Settings /> },
            { path: 'about', element: <About /> },
            { path: 'profile', element: <Profile /> },
          ],
        },
      ],
    },
    { path: '*', element: <Navigate to="/login" replace /> },
  ])
}
