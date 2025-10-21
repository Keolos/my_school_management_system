import React, { useEffect, useState } from 'react';
import { Calendar, Check, X, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

export function Attendance() {
  const { profile } = useAuth();
  const [records, setRecords] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.role === 'student') {
        loadStudentAttendance();
      } else {
        loadTeacherCourses();
      }
    }
  }, [profile]);

  useEffect(() => {
    if (selectedCourse && profile?.role === 'teacher') {
      loadCourseStudents();
      loadExistingAttendance();
    }
  }, [selectedCourse, selectedDate]);

  const loadStudentAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          course:courses(code, name)
        `)
        .eq('student_id', profile?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeacherCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, code, name')
        .eq('teacher_id', profile?.id);

      if (error) throw error;
      setCourses(data || []);
      if (data && data.length > 0) {
        setSelectedCourse(data[0].id);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          student:profiles(id, full_name, email)
        `)
        .eq('course_id', selectedCourse)
        .eq('status', 'active');

      if (error) throw error;
      const studentList = data?.map((e) => e.student) || [];
      setStudents(studentList);

      const initialAttendance = {};
      studentList.forEach((student) => {
        initialAttendance[student.id] = {
          student_id: student.id,
          status: 'present',
        };
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadExistingAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('course_id', selectedCourse)
        .eq('date', selectedDate);

      if (error) throw error;

      if (data && data.length > 0) {
        const existingAttendance = {};
        data.forEach((record) => {
          existingAttendance[record.student_id] = {
            student_id: record.student_id,
            status: record.status,
          };
        });
        setAttendance((prev) => ({ ...prev, ...existingAttendance }));
      }
    } catch (error) {
      console.error('Error loading existing attendance:', error);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { student_id: studentId, status },
    }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const attendanceRecords = Object.values(attendance).map((entry) => ({
        student_id: entry.student_id,
        course_id: selectedCourse,
        date: selectedDate,
        status: entry.status,
        marked_by: profile?.id,
        notes: '',
      }));

      for (const record of attendanceRecords) {
        const { error } = await supabase
          .from('attendance')
          .upsert(record, {
            onConflict: 'student_id,course_id,date',
          });

        if (error) throw error;
      }

      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700';
      case 'absent':
        return 'bg-red-100 text-red-700';
      case 'late':
        return 'bg-orange-100 text-orange-700';
      case 'excused':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <Check className="w-4 h-4" />;
      case 'absent':
        return <X className="w-4 h-4" />;
      case 'late':
        return <Clock className="w-4 h-4" />;
      case 'excused':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const calculateAttendanceStats = () => {
    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const late = records.filter((r) => r.status === 'late').length;

    return {
      total,
      present,
      absent,
      late,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // STUDENT VIEW
  if (profile?.role === 'student') {
    const stats = calculateAttendanceStats();

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Record</h1>
          <p className="text-gray-600 mt-1">
            Track your class attendance and participation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Overall Rate', value: `${stats.percentage}%`, color: 'text-blue-600' },
            { label: 'Present', value: stats.present, color: 'text-green-600' },
            { label: 'Absent', value: stats.absent, color: 'text-red-600' },
            { label: 'Late', value: stats.late, color: 'text-orange-600' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No attendance records yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {record.course.code} - {record.course.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {getStatusIcon(record.status)}
                      <span className="capitalize">{record.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // TEACHER VIEW
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-600 mt-1">Record student attendance for your classes</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Select Class & Date</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              options={courses.map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCourse && students.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Student List</h3>
              <Button onClick={saveAttendance} disabled={saving}>
                {saving ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{student.full_name}</p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>

                  <div className="flex space-x-2">
                    {['present', 'absent', 'late', 'excused'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(student.id, status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          attendance[student.id]?.status === status
                            ? getStatusColor(status) + ' ring-2 ring-offset-2 ring-gray-400'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="capitalize">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
