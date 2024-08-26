import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FloatingShape from './components/FloatingShape'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import DashboardPage from './pages/DashboardPage'
import LoadingSpinner from './components/LoadingSpinner'
import UpdateProfile from './pages/UpdateProfile';

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};
function App() {
  const {verifyAuth, isAuthenticated, isCheckingAuth, user} = useAuthStore();
  
  //first working checking Auth function
  useEffect(() => {
    verifyAuth();
  },[verifyAuth]);

  
  if(isCheckingAuth) return <LoadingSpinner/>
  return (
    <div className='min-h-screen bg-gradient-to-br
    from-[#00c7aa] via-[#55e6a5] to-[#008594] flex items-center justify-center relative overflow-hidden'>
        <FloatingShape color='bg-sky-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			  <FloatingShape color='bg-yellow-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			  <FloatingShape color='bg-[#09101a]' size='w-32 h-32' top='40%' left='-10%' delay={2} />

        <Routes>
          <Route path='/' element={
            <ProtectedRoute>
              <DashboardPage/>
            </ProtectedRoute>
          } />
          <Route path='/signup' 
                  element={
                    <RedirectAuthenticatedUser>
                      <SignUpPage/>
                    </RedirectAuthenticatedUser>
                  }
          />
          <Route path='/login' element={
                          <RedirectAuthenticatedUser>
                            <SignInPage/>
                          </RedirectAuthenticatedUser>
                        } />
          <Route path='/verify-email' element={<EmailVerificationPage />} />
          <Route path='/forgot-password' element={
                                  <RedirectAuthenticatedUser>
                                    <ForgotPasswordPage/>
                                  </RedirectAuthenticatedUser>
                                } />
          <Route path='/reset-password/:token' element={
                                <RedirectAuthenticatedUser>
                                  <ResetPasswordPage/>
                                </RedirectAuthenticatedUser>
                              } />
          <Route path='/update-profile/:id' element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          } />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
        <Toaster/>
    </div>
  )
}

export default App
