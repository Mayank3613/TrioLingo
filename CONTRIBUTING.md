# Contributing to TrioLingo++

Thank you for your interest in contributing to TrioLingo++! We want to make contributing to this project as easy and transparent as possible.

## 🚀 Getting Started

1. **Fork the Repository**: Create a fork of this repository to your own GitHub account.
2. **Clone the Repository**: Clone your fork to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/TrioLingo.git
   cd TrioLingo
   ```
3. **Install Dependencies**: Install the project dependencies using npm:
   ```bash
   npm install
   ```
4. **Run Dev Server**: Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *Note: If you want to develop desktop-native features, make sure you have the [Tauri prerequisites](https://tauri.app/start/prerequisites/) installed and run `npm run tauri dev`.*

---

## 🌿 Branching Strategy & Workflow

To keep the project history clean and manageable, please follow this workflow:

1. Create a new branch from `main` for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/your-fix-name
   ```
2. Make your edits and ensure there are no compilation errors by running:
   ```bash
   npm run build
   ```
3. Commit your changes with a clear and descriptive commit message following [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(vocabulary): add a new word search filter"
   ```
4. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request (PR) against our `main` branch.

---

## 🎨 Guidelines

### Coding Style
- Write clean, type-safe **TypeScript** code.
- Avoid using `any` types; define interfaces or types where appropriate.
- Follow the existing project structure (components in `src/components`, stores in `src/stores`, features in `src/features`, and static data in `src/data`).

### UI & UX Style
- TrioLingo++ uses modern, premium glassmorphism aesthetics. Ensure any new components match the active theme variables (`var(--bg-card)`, `var(--accent-primary)`, etc.).
- Use `motion` from `motion/react` for custom spring animations and hover effects.

---

## ❓ Need Help?

If you have any questions or run into issues, please feel free to open a discussion or file a GitHub issue.
