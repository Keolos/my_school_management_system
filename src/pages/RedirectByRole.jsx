import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../lib/auth';

export default function RedirectByRole() {
  const nav = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      const res = await getProfile();

      // If no profile found → redirect to login
      if (!res || !res.profile) {
        nav('/login');
        return;
      }

      // Extract role name safely
      const roleName = res.profile?.roles?.name;

      // Redirect based on role
      switch (roleName) {
        case 'admin':
          nav('/admin');
          break;
        case 'registrar':
          nav('/registrar');
          break;
        case 'teacher':
          nav('/teacher');
          break;
        case 'student':
          nav('/student');
          break;
        case 'old_user':
          nav('/student');
          break;
        default:
          nav('/');
          break;
      }
    };

    checkUserRole();
  }, [nav]);

  return <div className="p-6 text-gray-700 text-center">Redirecting...</div>;
}
