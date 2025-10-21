export default function TeacherPortal() {
  const students = ["Ama", "Kojo", "Yaw", "Abena"];
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teacher Portal</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Student</th>
            <th className="border p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {students.map((name) => (
            <tr key={name}>
              <td className="border p-2">{name}</td>
              <td className="border p-2">
                <input className="w-full border p-1" type="number" placeholder="Enter grade" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-4 bg-green-600 text-white py-2 px-4 rounded">Save Grades</button>
    </div>
  );
}
