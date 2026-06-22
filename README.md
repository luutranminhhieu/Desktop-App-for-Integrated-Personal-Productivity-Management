# promos

> Cross-platform desktop application for integrated personal productivity management. Built with **Electron + React 19 + TypeScript + Tailwind CSS** and connected directly to **MongoDB Atlas**.

---

## Key Modules

*   **Smart Todo List**: Priority-based task management with rich text notes (Tiptap Editor) and a Kanban board layout.
*   **Integrated Calendar**: Dynamic calendar view (FullCalendar) mapping task deadlines dynamically without redundant databases.
*   **Desktop Pomodoro Timer**: Persistent OS-level timer running in Node.js Main Process to prevent CPU throttling, with native system notifications.
*   **Performance Dashboard**: Real-time analytical charts (Recharts) and an optimized 365-day productivity log (Native SVG Heatmap).

---

## Quick Start

### 1. Environment Configuration
Create a local `.env` file at the project root by copying the template file:
```bash
cp .env.example .env
```
Open `.env` and fill in your actual credentials (MongoDB Atlas URI, SMTP host details, and Google OAuth credentials).

> [!WARNING]
> Never commit your `.env` file with actual secrets to git. It is ignored by default in `.gitignore`.

### 2. Installation & Development

```bash
# Install dependencies
npm install

# Run application in development mode
npm run dev
```

### 3. Production Build & Packaging

```bash
# Build for Windows (.exe)
npm run build:win
