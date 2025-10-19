# My School Management System

A modern web-based school management system built with TypeScript, PostgreSQL (via Supabase), and a Vite + Tailwind CSS front-end.  
It is designed to help schools efficiently manage students, teachers, classes, and administrative workflows in one intuitive platform.

---

## 📘 Table of Contents

- [Features](../Downloads/README.md#features)
- [Tech Stack](../Downloads/README.md#tech-stack)
- [Getting Started](../Downloads/README.md#getting-started)
  - [Prerequisites](../Downloads/README.md#prerequisites)
  - [Installation](../Downloads/README.md#installation)
  - [Database / Supabase Setup](../Downloads/README.md#database--supabase-setup)
  - [Running the App](../Downloads/README.md#running-the-app)
- [Project Structure](../Downloads/README.md#project-structure)
- [Usage](../Downloads/README.md#usage)
- [Contributing](../Downloads/README.md#contributing)
- [License](../Downloads/README.md#license)
- [Contact](../Downloads/README.md#contact)

---

## 🚀 Features

- Student, teacher, and class management  
- Role-based access control (administrators, teachers, students)  
- Secure authentication and data storage powered by Supabase  
- Fully responsive and elegant UI built with Tailwind CSS  
- TypeScript for strong typing and maintainability  
- Organized migration scripts in `supabase/migrations` for schema versioning  

---

## 🧩 Tech Stack

- **Frontend:** Vite + React (TypeScript)
- **Styling:** Tailwind CSS
- **Backend / Database:** Supabase (PostgreSQL + Auth + API)
- **Configuration & Tooling:**  
  - `vite.config.ts` — Build configuration  
  - `tailwind.config.js` — Tailwind setup  
  - `postcss.config.js` — PostCSS pipeline  
  - `eslint.config.js` — Linting rules  
  - `tsconfig.*.json` — TypeScript settings  
- **Database Migrations:** `supabase/migrations` (SQL/PLpgSQL)

---

## 🧰 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- A Supabase account ([https://supabase.com](https://supabase.com))
- Basic understanding of React, TypeScript, and PostgreSQL

---

### Installation

Clone this repository:

```bash
git clone https://github.com/Keolos/my_school_management_system.git
cd my_school_management_system
```

Install dependencies:

```bash
npm install
# or
yarn install
```

---

### Database / Supabase Setup

1. Log in to your Supabase dashboard and create a new project.  
2. Configure the database and take note of your API keys and connection string.  
3. Enable authentication (email/password or other providers) if required.  
4. Run migrations located in `supabase/migrations` to set up tables and functions:

```bash
# Using the Supabase CLI
supabase db push
# Or manually apply via Supabase SQL editor
```

5. Create a `.env` file in the project root and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_public_anon_key
```

---

### Running the App

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:5173/](http://localhost:5173/) to view the app.

For a production build:

```bash
npm run build
# or
yarn build
```

---

## 📁 Project Structure

```
my_school_management_system/
├─ src/                  # Frontend source code
├─ supabase/             # Supabase configuration and migrations
│   └─ migrations/       # SQL migration files
├─ index.html            # HTML entry point
├─ package.json          # Project dependencies & scripts
├─ vite.config.ts        # Vite build configuration
├─ tailwind.config.js    # Tailwind CSS setup
├─ postcss.config.js     # PostCSS configuration
└─ tsconfig*.json        # TypeScript configuration files
```

---

## 🧑‍💻 Usage

After launching the app, you can:

- Register and log in users  
- Add, edit, and delete students, teachers, and classes  
- Assign teachers to specific classes  
- Enroll students in classes  
- Manage schedules, grades, and attendance (if implemented)  
- Extend the system with new features like fees, reports, or notifications  

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repo  
2. Create a feature branch:  
   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit your changes:  
   ```bash
   git commit -m "Add new feature"
   ```
4. Push the branch:  
   ```bash
   git push origin feature/my-feature
   ```
5. Open a Pull Request on GitHub  

Please ensure your code follows existing conventions (TypeScript, ESLint, Tailwind).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](../Downloads/LICENSE) file for details.

---

## 📬 Contact

Developed by **[Keolos](https://github.com/Keolos)**  
📧 **Email:** [abdullahmohammednaji@gmail.com](mailto:abdullahmohammednaji@gmail.com)  

If you find this project useful, please ⭐️ it on [GitHub](https://github.com/Keolos/my_school_management_system)!

---

💡 *Built with passion for better school management solutions.*
