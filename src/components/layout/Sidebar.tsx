import { LayoutDashboard, Calendar, ClipboardCheck, FileText, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile } = useAuth();

  const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/timetable', icon: Calendar, label: 'Timetable' },
    { to: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
    { to: '/grades', icon: FileText, label: 'Grades & Reports' },
  ];

  const teacherLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/timetable', icon: Calendar, label: 'Timetable' },
    { to: '/attendance', icon: ClipboardCheck, label: 'Mark Attendance' },
    { to: '/grades', icon: FileText, label: 'Grade Management' },
  ];

  const links = profile?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Need Help?</p>
              <p className="text-xs text-gray-600">
                Contact support for assistance with your account.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
