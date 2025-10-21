export default function AdminPortal() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Portal</h2>
      <p>Manage users, assign roles, and organize classes.</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Create teacher accounts</li>
        <li>Manage student enrollments</li>
        <li>Approve registrar access</li>
      </ul>
    </div>
  );
}
