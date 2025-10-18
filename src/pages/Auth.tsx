import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

export function Auth() {
  const { user, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student' as 'student' | 'teacher',
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      } else {
        if (!formData.fullName) {
          setError('Full name is required');
          setLoading(false);
          return;
        }
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          formData.role
        );
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">SchoolHub</h1>
                <p className="text-gray-600">School Management System</p>
              </div>
            </div>

            <div className="space-y-4 mt-12">
              <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ClipboardCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Track Attendance</h3>
                  <p className="text-sm text-gray-600">Monitor and manage student attendance efficiently</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Grade Management</h3>
                  <p className="text-sm text-gray-600">Comprehensive grading and performance tracking</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Scheduling</h3>
                  <p className="text-sm text-gray-600">Organized timetables for students and teachers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to access your dashboard' : 'Join SchoolHub today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required={!isLogin}
                />

                <Select
                  label="I am a..."
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as 'student' | 'teacher' })
                  }
                  options={[
                    { value: 'student', label: 'Student' },
                    { value: 'teacher', label: 'Teacher' },
                  ]}
                />
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              helperText={!isLogin ? 'Minimum 6 characters' : undefined}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ClipboardCheck, FileText, Calendar } from 'lucide-react';
