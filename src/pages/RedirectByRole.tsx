// src/pages/RedirectByRole.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../lib/auth';

export default function RedirectByRole() {
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await getProfile();
      if (!res || !res.profile) {
        nav('/login');
        return;
      }
      const roleName = res.profile.roles?.name;
      switch (roleName) {
        case 'admin': nav('/admin'); break;
        case 'registrar': nav('/registrar'); break;
        case 'teacher': nav('/teacher'); break;
        case 'student': nav('/student'); break;
        case 'old_user': nav('/student'); break;
        default: nav('/'); break;
      }
    })();
  }, []);

  return <div className="p-6">Redirecting...</div>;
}
