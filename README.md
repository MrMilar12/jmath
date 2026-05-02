# jmath 🧮

**An interactive math space for learners.**

jmath is a browser-based quiz app that helps learners practise core arithmetic skills through an engaging, timed multiple-choice format.

## Features

- **Five topics** — Addition, Subtraction, Multiplication, Division, and Mixed
- **Three difficulty levels** — Easy, Medium, and Hard (larger numbers & shorter timers)
- **10 questions per round** with a per-question countdown timer
- **Time-bonus scoring** — answer faster to earn extra points
- **High-score board** — top 5 scores are saved in the browser (localStorage)
- **Instant feedback** — correct answer highlighted after every question

## Getting Started

No build step required — just open `index.html` in any modern browser:

```bash
# Clone the repo
git clone https://github.com/MrMilar12/jmath.git
cd jmath

# Open directly in your default browser
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Or serve it with any static file server:

```bash
npx serve .
# then visit http://localhost:3000
```

## Project Structure

```
jmath/
├── index.html   # Application shell
├── style.css    # Dark-theme styles
├── app.js       # Quiz logic (question generation, timer, scoring)
└── README.md
```

## How to Play

1. Pick a **topic** (e.g. Multiplication).
2. Choose a **difficulty** level.
3. Press **Start Quiz**.
4. Select your answer before the timer runs out.
5. Review your score and practice to beat it!

## License

MIT