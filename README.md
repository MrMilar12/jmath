# Gen Math Interactive Website

Web-based interactive learning module for General Mathematics (First Quarter), designed for both development and thesis use.

## Project Title

Development of a Web-Based Interactive Learning Module for General Mathematics (First Quarter)

## Objective

The system is built to:

1. Improve understanding of key General Mathematics concepts.
2. Address least learned competencies:
	 1. Interpreting measures of central tendency and variability.
	 2. Identifying the appropriate measure for different data sets.
	 3. Solving practical problems involving piecewise functions.
3. Increase engagement through interactive, game-based learning.

## System Type

- Web app with frontend and backend
- Frontend: HTML + CSS + JavaScript
- Backend: PHP (no framework required)
- Database: MySQL (via XAMPP / phpMyAdmin)
- Authentication: user account (register/login)
- Multi-child profiles per user
- Child-specific progress + assessment records in MySQL

## Competency-Based Modules

### Module 1: Statistics

- Dataset input and auto-computation:
	- Mean, Median, Mode
	- Range, Variance, Standard Deviation
- Visual charts via Canvas API:
	- Bar chart
	- Box plot
- Data Detective mini-game:
	- Students pick Mean/Median/Mode for real dataset cases
	- Instant rationale and outlier-aware feedback

### Module 2: Piecewise Functions

- Real-life scenarios:
	- Taxi fare
	- Electricity billing
	- Mobile data pricing
- Build the Function activity:
	- Live piecewise graph
	- Active interval highlighting
- Guess the Output activity:
	- Student predicts output for given input
	- Immediate correctness checking

### Module 3: Quadratic Functions

- Dynamic graph engine:
	- Adjustable coefficients a, b, c
	- Real-time parabola updates
- Find the Vertex game:
	- Random quadratic rounds
	- Score rewards based on accuracy

## Quiz and Analytics

- Competency-based quiz items with immediate rationale
- Performance tracked per competency:
	- Interpretation
	- Selection
	- Problem-solving
- Results dashboard includes:
	- Competency percentages
	- Visual competency chart
	- Auto-generated feedback statements

## Gamification

- XP points
- Level progression
- Badge unlocking
- Completion indicators per module

## Data Storage

### MySQL Database

- User accounts (`users` table)
- Child profiles (`children` table)
- Per-child progress snapshots (`child_progress` table)
- Per-assessment records (`assessment_results` table)
- Schema: see `setup.sql`

### Browser Local Cache

- Session token + selected child
- Theme preference
- Temporary offline cache of current child progress

## Learning Flow

1. Interactive module entry
2. Guided activity/discussion prompt
3. Hands-on interaction
4. Quiz check or challenge
5. Results and analytics feedback

## Tech Stack

- HTML
- CSS (glassmorphism-inspired UI)
- JavaScript
- Canvas API (for charts and graphing)

## How to Run

1. Install [XAMPP](https://www.apachefriends.org/) and start **Apache** and **MySQL** from the XAMPP Control Panel.
2. Open **phpMyAdmin** (`http://localhost/phpmyadmin`), click the **SQL** tab, paste the contents of `setup.sql`, and click **Go** to create the database and tables.
3. Copy the entire project folder into `C:\xampp\htdocs\jmath\`.
4. *(Optional)* Open `api/config.php` and update `DB_USER` / `DB_PASS` if your MySQL credentials differ from the default (`root` / blank).
5. Visit `http://localhost/jmath/` in your browser.
6. Register a user account, add a child profile, and start learning.

> `server.js` and `package.json` are no longer used — the backend is now pure PHP handled by files in the `api/` folder.

## Suggested Next Development Phases

1. Add pre-test and post-test workflow for research evaluation.
2. Add export feature (CSV/JSON) for thesis data analysis.
3. Add more item banks per competency for repeated practice.