# Sissy Skill Tracker

A private, offline-first progression tracker designed for GitHub Pages. It uses only HTML, CSS, JavaScript, and browser `localStorage`; no server, account, database, npm, or build step is required.

## Features

- Nine fixed skill categories: Dress Up, Makeup, High Heels, Hygiene, Servitude, Anal, Oral, Exposure, and Sexual Prowess
- Unlimited user-created tasks inside each category
- Difficulty slider from 1–10
- One XP awarded per difficulty level when a task is completed
- Independent Level 0–100 progression for each category
- 10,000 XP reaches Level 100
- Unlimited Mastery Points beyond 10,000 XP
- Category-specific rank names every ten levels and a unique Level 100 rank
- Simple personal objectives
- Timed task objectives: complete a selected task X times within a chosen time
- Completion history with task undo support
- Dark and light modes selected in Settings
- Optional animations, floating XP notifications, and sound effects
- JSON backup export and import
- Offline PWA support
- Responsive desktop and mobile UI

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload every file and folder from this project to the repository root.
3. Open **Settings → Pages** in the GitHub repository.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. Open the GitHub Pages URL after deployment completes.

## Local testing

Opening `index.html` directly works for most functionality, but service workers and PWA installation require an HTTP server.

With Python installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Data and privacy

All progression is saved in the current browser through `localStorage`. Nothing is uploaded by the app. Browser data can be cleared, so regularly use **Settings → Export Backup** and store the JSON file safely.

The detailed activity history keeps the latest 10,000 events to avoid exceeding browser storage limits. Category XP and task completion totals are not affected when older activity entries leave the history.
