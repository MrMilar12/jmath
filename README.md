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
- Backend: Node.js + Express + SQLite
- Authentication: user account (register/login)
- Multi-child profiles per user
- Child-specific progress + assessment records in SQLite

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

### SQLite Database

- User accounts (`users` table)
- Child profiles (`children` table)
- Per-child progress snapshots (`child_progress` table)
- Per-assessment records (`assessment_results` table)

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

1. Install dependencies:
   - `npm install`
2. Start the app server:
   - `npm start`
3. Open `http://localhost:3000` in your browser.
4. Register a user account or login.
5. Add/select a child profile.
6. Start learning; quiz and competency statistics are saved to the selected child profile.

## Suggested Next Development Phases

1. Add pre-test and post-test workflow for research evaluation.
2. Add export feature (CSV/JSON) for thesis data analysis.
3. Add more item banks per competency for repeated practice.