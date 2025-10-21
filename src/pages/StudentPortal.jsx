export default function StudentPortal() {
  const classes = ["Basic 1", "Basic 2", "Basic 3", "JHS 1", "JHS 2", "JHS 3", "SHS 1", "SHS 2", "SHS 3"];
  const subjects = ["Mathematics", "English", "Science", "ICT", "Social Studies", "RME", "French"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Student Portal</h2>
      <p className="mb-2">Select your class and register subjects for the term:</p>
      <select className="border p-2 rounded mb-4">
        {classes.map((cls) => <option key={cls}>{cls}</option>)}
      </select>

      <div className="grid grid-cols-2 gap-2">
        {subjects.map((subject) => (
          <label key={subject} className="flex items-center space-x-2">
            <input type="checkbox" />
            <span>{subject}</span>
          </label>
        ))}
      </div>
      <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">Submit</button>
    </div>
  );
}
