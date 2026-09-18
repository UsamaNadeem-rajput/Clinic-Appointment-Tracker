# Smart Clinic Appointment Queue Tracker

Smart Clinic Appointment Queue Tracker is a full-stack clinic appointment system that helps patients book available time slots and helps doctors manage their daily queue. Patients receive a token number when they book an appointment, while doctors can view appointments and call the next token during consultations.

## Core Idea

The project replaces manual clinic queues with a simple digital workflow:

1. A patient creates an account and logs in.
2. The patient views available doctors and their schedules.
3. The patient selects an available 15-minute slot and books an appointment.
4. The system assigns a queue token automatically for that schedule.
5. The doctor views the appointment queue and calls the next token.
6. Appointment statuses move through `booked`, `in-consultation`, `completed`, or `cancelled`.

## Features

- Patient and doctor registration/login
- Role-based protected routes
- HTTP-only JWT cookie authentication
- Doctor schedule creation and management
- Available appointment slot generation
- Duplicate booking protection
- Automatic queue token assignment
- Doctor appointment queue view
- Transaction-safe next-token processing
- Patient appointment history and status tracking
- MySQL database integration

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- CSS Modules

### Backend

- Node.js
- Express 5
- MySQL with `mysql2`
- JWT
- bcryptjs
- CORS and cookie-parser

## Project Structure

```text
.
├── my-app/                 # React frontend
│   ├── src/
│   │   ├── Authentication/ # Login, registration, logout
│   │   ├── Navbar/         # Application navigation
│   │   ├── content/        # Doctor, patient, slot and token screens
│   │   └── context/        # Authentication context and route protection
│   └── package.json
└── server/                 # Express backend
	├── auth/               # Registration, login and logout routes
	├── controller/         # Schedules, doctors and appointments
	├── middlewares/        # JWT and role validation
	├── model/              # MySQL connection pool
	└── server.js
```

## Prerequisites

- Node.js 18 or newer
- MySQL 8 or newer
- Git

## Local Installation

Clone the repository and install dependencies in both applications:

```bash
git clone <your-repository-url>
cd Smart-Clinic-Appointment-Queue-Tracker

cd my-app
npm install

cd ../server
npm install
```

## Database Setup

Create a MySQL database named `smart-clinic-system`, then create the tables required by the backend:

- `users`
- `doctor_schedules`
- `appointments`

The backend currently connects to MySQL with the following local defaults:

```text
Host: localhost
User: root
Password: empty
Database: smart-clinic-system
```

Update `server/model/db.js` if your MySQL credentials are different.

## Environment Variables

Create `server/.env` and add the JWT signing secret:

```env
SECERET_KEY=replace-with-a-long-random-secret
```

The current backend uses the variable name `SECERET_KEY` exactly as shown above.

## Running the Application

Start the backend in one terminal:

```bash
cd server
npm start
```

The API runs at `http://localhost:3000`.

Start the frontend in another terminal:

```bash
cd my-app
npm run dev
```

Open `http://localhost:5173` in your browser.

## Main API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/register` | Register a patient or doctor |
| `POST` | `/login` | Log in and create an auth cookie |
| `GET` | `/logout` | Clear the auth cookie |
| `GET` | `/api/session` | Check the current session |
| `GET` | `/api/show/doctors` | List doctors and schedules |
| `POST` | `/api/doctor/schedules` | Create a doctor schedule |
| `GET` | `/api/doctor/schedules/allscheduals` | View a doctor's schedules |
| `GET` | `/api/doctor/schedules/availables/:scheduleId` | View a schedule's queue |
| `PATCH` | `/api/doctor/schedules/:scheduleId/next-token` | Call the next patient token |
| `GET` | `/api/patient/appointment/:doctorId` | View available slots |
| `POST` | `/api/patient/addappointment` | Book an appointment |
| `GET` | `/api/patient/appointment/my-appointment` | View patient appointments |

## Available Scripts

### Frontend (`my-app`)

```bash
npm run dev      # Start Vite development server
npm run build    # Create production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend (`server`)

```bash
npm start        # Start the API with nodemon
```

## Roadmap

- Add database migration/schema scripts
- Add appointment cancellation from the patient dashboard
- Add doctor profile and clinic information
- Add notifications for upcoming appointments
- Add automated frontend and API tests
- Move database credentials to environment variables

## License

This project is currently available for learning and portfolio use.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
