import { useState } from "react";
import { classLevels, subjectsPerLevel } from "../data/subjects";

export default function Subjects() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const handleLevelChange = (e) => {
    const level = e.target.value;
    setSelectedLevel(level);
    setSubjects(subjectsPerLevel[level] || []);
    setSelectedSubjects([]);
  };

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Subjects registered for ${selectedLevel}: ${selectedSubjects.join(", ")}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
          Subject Registration
        </h2>

        <select
          onChange={handleLevelChange}
          value={selectedLevel}
          required
          className="w-full border rounded p-2 mb-4"
        >
          <option value="">Select Class Level</option>
          {classLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        {subjects.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Available Subjects:</h3>
            {subjects.map((subject) => (
              <label key={subject} className="block mb-1">
                <input
                  type="checkbox"
                  value={subject}
                  onChange={() => toggleSubject(subject)}
                  checked={selectedSubjects.includes(subject)}
                  className="mr-2"
                />
                {subject}
              </label>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Register Subjects
        </button>
      </form>
    </div>
  );
}
