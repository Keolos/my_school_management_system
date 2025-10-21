import { useEffect, useState } from 'react';
import { TrendingUp, Award, FileText, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';

export function Grades() {
  const { profile } = useAuth();
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [gradeForm, setGradeForm] = useState({
    assessment_type: 'assignment',
    assessment_name: '',
    score: '',
    max_score: '',
    feedback: '',
  });

  useEffect(() => {
    if (profile) {
      if (profile.role === 'student') {
        loadStudentGrades();
      } else {
        loadTeacherCourses();
      }
    }
  }, [profile]);

  useEffect(() => {
    if (selectedCourse && profile?.role === 'teacher') {
      loadCourseStudents();
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedStudent && selectedCourse && profile?.role === 'teacher') {
      loadStudentGradesForCourse();
    }
  }, [selectedStudent, selectedCourse]);

  const loadStudentGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          course:courses(code, name)
        `)
        .eq('student_id', profile?.id)
        .order('graded_at', { ascending: false });

      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error('Error loading grades:', error);
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
      if (studentList.length > 0) {
        setSelectedStudent(studentList[0].id);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadStudentGradesForCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          course:courses(code, name)
        `)
        .eq('student_id', selectedStudent)
        .eq('course_id', selectedCourse)
        .order('graded_at', { ascending: false });

      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase.from('grades').insert({
        student_id: selectedStudent,
        course_id: selectedCourse,
        assessment_type: gradeForm.assessment_type,
        assessment_name: gradeForm.assessment_name,
        score: parseFloat(gradeForm.score),
        max_score: parseFloat(gradeForm.max_score),
        feedback: gradeForm.feedback,
        graded_by: profile?.id,
      });

      if (error) throw error;

      setGradeForm({
        assessment_type: 'assignment',
        assessment_name: '',
        score: '',
        max_score: '',
        feedback: '',
      });
      setShowAddGrade(false);
      loadStudentGradesForCourse();
      alert('Grade added successfully!');
    } catch (error) {
      console.error('Error adding grade:', error);
      alert('Failed to add grade');
    } finally {
      setSaving(false);
    }
  };

  const calculateStats = () => {
    if (grades.length === 0) {
      return { average: 0, highest: 0, lowest: 0, total: 0 };
    }

    const percentages = grades.map((g) => g.percentage);
    const average = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);

    return {
      average: Math.round(average),
      highest: Math.round(highest),
      lowest: Math.round(lowest),
      total: grades.length,
    };
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = calculateStats();

  if (profile?.role === 'student') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades & Reports</h1>
          <p className="text-gray-600 mt-1">Track your academic performance and progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className={`text-3xl font-bold mt-2 ${getGradeColor(stats.average)}`}>
                  {stats.average}%
                </p>
                <p className="text-lg font-semibold text-gray-700 mt-1">
                  {getGradeLetter(stats.average)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Highest Grade</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.highest}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Lowest Grade</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.lowest}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Grade History</h3>
          </CardHeader>
          <CardContent>
            {grades.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No grades posted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {grades.map((grade) => (
                  <div
                    key={grade.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded uppercase">
                            {grade.assessment_type}
                          </span>
                          <p className="font-semibold text-gray-900">{grade.assessment_name}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {grade.course.code} - {grade.course.name}
                        </p>
                        {grade.feedback && (
                          <p className="text-sm text-gray-700 mt-2 p-3 bg-white rounded border border-gray-200">
                            <span className="font-medium">Feedback:</span> {grade.feedback}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(grade.graded_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-3xl font-bold ${getGradeColor(grade.percentage)}`}>
                          {Math.round(grade.percentage)}%
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {grade.score}/{grade.max_score}
                        </p>
                        <p className="text-lg font-semibold text-gray-700 mt-1">
                          {getGradeLetter(grade.percentage)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grade Management</h1>
          <p className="text-gray-600 mt-1">Add and manage student grades for your courses</p>
        </div>
        <Button onClick={() => setShowAddGrade(!showAddGrade)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Grade
        </Button>
      </div>
      {/* Teacher View */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Select Course & Student</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              options={courses.map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` }))}
            />

            {students.length > 0 && (
              <Select
                label="Student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                options={students.map((s) => ({ value: s.id, label: s.full_name }))}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
