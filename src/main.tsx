import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import GuestOnly from '@/components/common/GuestOnly';
import Layout from '@/components/common/Layout';
import RequireAuth from '@/components/common/RequireAuth';
import ChatPage from '@/pages/ChatPage';
import ChatPauseTestPage from '@/pages/ChatPauseTestPage';
import HomePage from '@/pages/HomePage';
import KakaoCallbackPage from '@/pages/KakaoCallbackPage';
import LoginPage from '@/pages/LoginPage';
import MyPage from '@/pages/MyPage';
import NotFoundPage from '@/pages/NotFoundPage';
import SignupPage from '@/pages/SignupPage';
import OnboardingPage from '@/pages/OnboardingPage';
import PhilosopherExplorePage from '@/pages/PhilosopherExplorePage';
import PhilosopherSelectPage from '@/pages/PhilosopherSelectPage';

import './index.css';

// 개발 모드에서만 콘솔에 ilseToken(토큰)을 열어 둔다. 배포 빌드에는 들어가지 않는다
if (import.meta.env.DEV) import('@/lib/devAuth');

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { element: <GuestOnly />, children: [{ path: '/', element: <LoginPage /> }] },
      {
        element: <RequireAuth />,
        children: [
          { path: '/onboarding', element: <OnboardingPage /> },
          { path: '/philosophers', element: <PhilosopherSelectPage /> },
          { path: '/home', element: <HomePage /> },
          { path: '/explore', element: <PhilosopherExplorePage /> },
          { path: '/chat', element: <ChatPage /> },
          // 주소에 방 ID가 있어야 새로고침·뒤로 가기 후에도 같은 방을 서버에서 다시 불러온다
          { path: '/chat/:conversationId', element: <ChatPage /> },
          { path: '/mypage', element: <MyPage /> },
        ],
      },
      ...(import.meta.env.DEV ? [{ path: '/chat/test', element: <ChatPauseTestPage /> }] : []),
      { path: '/auth/kakao/callback', element: <KakaoCallbackPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
