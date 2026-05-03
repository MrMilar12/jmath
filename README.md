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

- Static website: HTML + CSS + JavaScript
- No backend
- Uses LocalStorage for persistence
- Can run offline (no required external API)

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

## Data Stored in LocalStorage

- XP, level, badges
- Module completion flags
- Competency scores and attempts
- Quiz history
- UI theme preference

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

1. Open `index.html` in a browser.
2. Start with Module 1, 2, or 3 from the home screen.
3. Open Results & Analytics to view competency progress.

## Suggested Next Development Phases

1. Add pre-test and post-test workflow for research evaluation.
2. Add export feature (CSV/JSON) for thesis data analysis.
3. Add more item banks per competency for repeated practice.