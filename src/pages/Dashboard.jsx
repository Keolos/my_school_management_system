import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, ClipboardCheck, TrendingUp, Users, Award, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    attendanceRate: 0,
    averageGrade: 0,
    upcomingClasses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    try {
      if (profile?.role === 'student') {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('*')
          .eq('student_id', profile.id)
          .eq('status', 'active');

        const { data: attendance } = await supabase
          .from('attendance')
          .select('*')
          .eq('student_id', profile.id);

        const { data: grades } = await supabase
          .from('grades')
          .select('*')
          .eq('student_id', profile.id);

        const totalCourses = enrollments?.length || 0;
        const presentCount = attendance?.filter((a) => a.status === 'present').length || 0;
        const totalAttendance = attendance?.length || 1;
        const attendanceRate = (presentCount / totalAttendance) * 100;

        const avgGrade = grades?.length
          ? grades.reduce((acc, g) => acc + g.percentage, 0) / grades.length
          : 0;

        setStats({
          totalCourses,
          attendanceRate: Math.round(attendanceRate),
          averageGrade: Math.round(avgGrade),
          upcomingClasses: totalCourses,
        });
      } else {
        const { data: courses } = await supabase
          .from('courses')
          .select('*')
          .eq('teacher_id', profile?.id);

        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('*, courses!inner(*)')
          .eq('courses.teacher_id', profile?.id);

        setStats({
          totalCourses: courses?.length || 0,
          attendanceRate: enrollments?.length || 0,
          averageGrade: 0,
          upcomingClasses: courses?.length || 0,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your {profile?.role === 'student' ? 'studies' : 'classes'} today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {profile?.role === 'student' ? 'Enrolled Courses' : 'Total Courses'}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCourses}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {profile?.role === 'student' ? 'Attendance Rate' : 'Total Students'}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {profile?.role === 'student' ? `${stats.attendanceRate}%` : stats.attendanceRate}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <ClipboardCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {profile?.role === 'student' && (
          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Grade</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageGrade}%</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {profile?.role === 'student' ? 'Active Courses' : 'Active Classes'}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingClasses}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile?.role === 'student' ? (
              <>
                <ActionButton
                  icon={Calendar}
                  title="View Timetable"
                  description="Check your class schedule"
                  color="blue"
                />
                <ActionButton
                  icon={FileText}
                  title="View Grades"
                  description="Check your academic performance"
                  color="green"
                />
                <ActionButton
                  icon={ClipboardCheck}
                  title="Attendance Record"
                  description="View your attendance history"
                  color="orange"
                />
              </>
            ) : (
              <>
                <ActionButton
                  icon={ClipboardCheck}
                  title="Mark Attendance"
                  description="Take attendance for your classes"
                  color="blue"
                />
                <ActionButton
                  icon={FileText}
                  title="Grade Students"
                  description="Enter and manage student grades"
                  color="green"
                />
                <ActionButton
                  icon={Users}
                  title="Manage Classes"
                  description="View and organize your courses"
                  color="purple"
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                icon={Award}
                title={profile?.role === 'student' ? 'New grade posted' : 'Grades submitted'}
                description={profile?.role === 'student' ? 'Mathematics - Assignment 3' : 'Computer Science - Quiz 2'}
                time="2 hours ago"
                color="green"
              />
              <ActivityItem
                icon={ClipboardCheck}
                title={profile?.role === 'student' ? 'Attendance marked' : 'Attendance recorded'}
                description={profile?.role === 'student' ? 'Present in Physics class' : '28/30 students present'}
                time="5 hours ago"
                color="blue"
              />
              <ActivityItem
                icon={Calendar}
                title="Schedule updated"
                description={profile?.role === 'student' ? 'New class timings posted' : 'Room changed for CS101'}
                time="1 day ago"
                color="orange"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, title, description, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
  }[color];

  return (
    <button className="w-full flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group text-left">
      <div className={`p-2 rounded-lg transition-colors ${colorClasses}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </button>
  );
}

function ActivityItem({ icon: Icon, title, description, time, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
  }[color];

  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-lg ${colorClasses}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 truncate">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
