import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader } from "../components/ui/Card";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Timetable() {
  const { profile } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadTimetable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const loadTimetable = async () => {
    try {
      if (profile?.role === "student") {
        const { data, error } = await supabase
          .from("timetable")
          .select(`
            *,
            course:courses!inner(
              code,
              name,
              teacher:profiles!courses_teacher_id_fkey(full_name)
            )
          `)
          .in(
            "course_id",
            supabase
              .from("enrollments")
              .select("course_id")
              .eq("student_id", profile.id)
              .eq("status", "active")
          );

        if (error) throw error;
        setTimetable(data || []);
      } else {
        const { data, error } = await supabase
          .from("timetable")
          .select(`
            *,
            course:courses!inner(
              code,
              name
            )
          `)
          .eq("courses.teacher_id", profile?.id);

        if (error) throw error;
        setTimetable(data || []);
      }
    } catch (error) {
      console.error("Error loading timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimetableForDay = (dayIndex) => {
    return timetable
      .filter((entry) => entry.day_of_week === dayIndex)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading timetable...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
        <p className="text-gray-600 mt-1">
          Your weekly timetable at a glance
        </p>
      </div>

      {timetable.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No classes scheduled
            </h3>
            <p className="text-gray-600">
              {profile?.role === "student"
                ? "Your class schedule will appear here once you enroll in courses."
                : "Your teaching schedule will appear here once classes are scheduled."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {DAYS.slice(1, 6).map((day, index) => {
            const dayIndex = index + 1;
            const classes = getTimetableForDay(dayIndex);
            const isToday = new Date().getDay() === dayIndex;

            return (
              <Card key={day} className={isToday ? "ring-2 ring-blue-500" : ""}>
                <CardHeader className={isToday ? "bg-blue-50" : ""}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{day}</h3>
                    {isToday && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                        Today
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 min-h-[200px]">
                  {classes.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-400">
                      <p className="text-sm">No classes</p>
                    </div>
                  ) : (
                    classes.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {entry.course.code}
                            </p>
                            <p className="text-sm text-gray-700 mt-0.5">
                              {entry.course.name}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1.5 mt-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <MapPin className="w-4 h-4" />
                            <span>Room {entry.room}</span>
                          </div>
                          {profile?.role === "student" && entry.course.teacher && (
                            <div className="flex items-center space-x-2 text-sm text-gray-700 mt-2 pt-2 border-t border-blue-200">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {entry.course.teacher.full_name.charAt(0)}
                              </div>
                              <span>{entry.course.teacher.full_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
