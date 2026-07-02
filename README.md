# ⚡ Promos — Integrated Personal Productivity Management

<p align="center">
  <a href="https://github.com/luutranminhhieu/Desktop-App-for-Integrated-Personal-Productivity-Management">
    <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg?style=for-the-badge" alt="Version">
  </a>
  <a href="https://electronjs.org">
    <img src="https://img.shields.io/badge/Electron-v39.2.6-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron">
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/React-v19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
  </a>
  <a href="https://typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-v5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  </a>
  <a href="https://mongodb.com">
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  </a>
</p>

---

## About the Project

### What does the project do?
**Promos** (original project name: *promos*) is a cross-platform desktop application for integrated personal productivity management (**Integrated Personal Productivity Management**). The project is meticulously designed to provide users with a seamless, efficient, and minimalist workspace.

### Why was it created?
In modern work environments, tool fragmentation (taking notes, scheduling, tracking tasks, and using Pomodoro timers across different software) leads to distraction due to constant context switching (**Context Switching**). Promos was born to address this issue by integrating all core productivity utilities into a single, unified desktop window.

### Key Solutions & Features
*   **Avoid Distraction**: Consolidates note-taking, planning, Pomodoro tracking, and progress monitoring into a single, cohesive application.
*   **Prevent CPU Throttling**: The Pomodoro timer runs directly in the background process (Node.js Main Process) instead of the Renderer/Browser, ensuring absolute accuracy even when the application is minimized.
*   **Smart Time Synchronization**: Automatically maps task deadlines into calendar events on the Schedule (FullCalendar) without requiring redundant data entry.
*   **Visual Productivity Reporting**: A 12-week productivity heatmap helps users review and evaluate their daily focus efforts at a glance.

---

## Technology Stack

| Component | Technology | Purpose & Details |
| :--- | :--- | :--- |
| **Desktop Shell** | [Electron](https://www.electronjs.org/) | Packages the application to run natively on Windows, macOS, and Linux. |
| **Frontend Framework** | [React 19](https://react.dev/) + TS | Develops reliable, high-performance, and type-safe UI components. |
| **Style Framework** | [Tailwind CSS v4](https://tailwindcss.com/) | Builds a modern, minimalist, and responsive user interface layout. |
| **Database ORM** | [Mongoose](https://mongoosejs.com/) | Connects and manages data securely with **MongoDB Atlas**. |
| **Scheduler System** | [FullCalendar](https://fullcalendar.io/) | Provides an interactive drag-and-drop calendar grid for event management. |
| **Rich Text Engine** | [Tiptap Editor](https://tiptap.dev/) | Powers a smooth, full-featured rich-text editing experience for note-taking. |
| **Data Visualizer** | [Recharts](https://recharts.org/) | Renders real-time analytical charts to track productivity trends. |

---

## Installation & Quick Start

### System Requirements
*   **Node.js**: Version 18.x or higher.
*   **NPM** or **Yarn** configured on your local machine.
*   A **MongoDB Atlas** account for cloud database connection.

### 1. Clone the Project and Install Dependencies
```bash
# Clone the project from GitHub
git clone https://github.com/luutranminhhieu/Desktop-App-for-Integrated-Personal-Productivity-Management.git

# Navigate to the project directory
cd Desktop-App-for-Integrated-Personal-Productivity-Management

# Install all dependencies
npm install
```

### 2. Configure Environment Variables
Create a copy of the template file `.env.example` and name it `.env`:
```bash
cp .env.example .env
```

### 3. Run in Development Mode
Launch the desktop application in development mode (with hot-reload support):
```bash
npm run dev
```

---

## Production Build & Packaging

To compile and package the application for production on your personal computer, run the appropriate command for your target operating system:

```bash
# Package for Windows (creates a .exe installer)
npm run build:win

# Package for macOS (creates a .dmg installer)
npm run build:mac

# Package for Linux (creates a .deb or .AppImage package)
npm run build:linux
```

The packaged installers will be generated in the `/dist` directory at the root of the project.

---

## License

This project is licensed under the **MIT License**. You are free to study, modify, and redistribute this source code.
