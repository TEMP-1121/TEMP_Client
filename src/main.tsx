import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import Layout from '@/components/common/Layout'
import ChatPage from '@/pages/ChatPage'
import HomePage from '@/pages/HomePage'
import KakaoCallbackPage from '@/pages/KakaoCallbackPage'
import MyPage from '@/pages/MyPage'
import NotFoundPage from '@/pages/NotFoundPage'
import SignupPage from '@/pages/SignupPage'

import './index.css'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/mypage', element: <MyPage /> },
      { path: '/auth/kakao/callback', element: <KakaoCallbackPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
