// src/App.tsx
import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">
            My School Management System
          </h1>
          <nav className="space-x-6">
            <a href="#features" className="text-indigo-600 hover:text-indigo-800">Features</a>
            <a href="#tech" className="text-indigo-600 hover:text-indigo-800">Tech Stack</a>
            <a href="#contact" className="text-indigo-600 hover:text-indigo-800">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-b from-indigo-50 to-white">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Effortless School Administration
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          A modern web-based system built with TypeScript, Supabase, and Tailwind CSS
          to manage students, teachers, classes, and more—all in one platform.
        </p>
        <a
          href="#features"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Learn More
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Student & Teacher Management",
                desc: "Create, edit and manage student, teacher, and class records seamlessly."
              },
              {
                title: "Role-Based Access",
                desc: "Admins, teachers, and students get access based on assigned permissions."
              },
              {
                title: "Responsive Interface",
                desc: "Built with Tailwind CSS for a modern and mobile-friendly experience."
              },
              {
                title: "Supabase Integration",
                desc: "Secure authentication and PostgreSQL-powered backend."
              },
              {
                title: "TypeScript Reliability",
                desc: "Strongly-typed codebase ensures stability and scalability."
              },
              {
                title: "Easy Deployment",
                desc: "Optimized for deployment on modern platforms like Vercel or Netlify."
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-indigo-50 rounded-xl shadow hover:shadow-lg transition">
                <h4 className="text-xl font-semibold text-indigo-700 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-8">Tech Stack</h3>
          <ul className="text-lg text-gray-700 space-y-3">
            <li><strong>Frontend:</strong> Vite + React + TypeScript</li>
            <li><strong>Styling:</strong> Tailwind CSS</li>
            <li><strong>Backend:</strong> Supabase (PostgreSQL + Auth + API)</li>
            <li><strong>Tooling:</strong> Vite config, TypeScript, ESLint, PostCSS</li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h3>
        <p className="text-gray-600 mb-6">
          Developed by <a href="https://github.com/Keolos" className="text-indigo-600 hover:underline">Keolos</a>
        </p>
        <a
          href="mailto:abdullahmohammednaji@gmail.com"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Contact Me
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Keolos — All rights reserved.
      </footer>
    </div>
  )
}
