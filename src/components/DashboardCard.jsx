export default function DashboardCard({ title, description, link }) {
  return (
    <a href={link} className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition">
      <h3 className="text-xl font-bold mb-2 text-blue-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </a>
  );
}
