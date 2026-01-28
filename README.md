# Course Enrollment Dashboard

A Next.js dashboard application for managing courses with session scheduling and student registration. Built with Next.js, MongoDB, Mongoose, and ShadCN UI.

## Features

- ✅ Full CRUD operations for courses
- ✅ Course session management (multiple time slots per course)
- ✅ Student registration with course and session selection
- ✅ Admin dashboard to view all registered students
- ✅ MongoDB integration with Mongoose
- ✅ Form validation with Zod and React Hook Form
- ✅ Beautiful UI with ShadCN components
- ✅ Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection URI
MONGODB_URI=your_mongodb_connection_string_here
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables (see above)

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Usage

### Admin Dashboard

The admin dashboard allows you to:
- Create courses with multiple sessions (e.g., 8:00-9:00, 10:00-11:00)
- Edit existing courses
- Delete courses
- View all registered students with their details

### Creating a Course

1. Navigate to the admin dashboard
2. Click the "Add Course" button
3. Enter a course name
4. Add one or more sessions by clicking "Add Session"
5. Enter start time and end time for each session (e.g., "8:00" and "9:00")
6. Click "Save"

### Student Registration

1. Navigate to the student registration page
2. Fill in your details:
   - Name
   - Email
   - University
   - Phone number
   - Select a course
   - Select one or more sessions
3. Click "Register for Course"

### Viewing Registered Students

1. In the admin dashboard, click the "Students" tab
2. View all registered students with their:
   - Name, Email, University, Phone number
   - Selected course
   - Selected sessions
   - Registration date

## Project Structure

```
course-enrollment/
├── app/
│   ├── api/
│   │   ├── courses/        # Course CRUD API routes
│   │   └── students/       # Student registration API routes
│   ├── join-group-course/  # Student registration page
│   ├── page.tsx           # Main admin dashboard page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                 # ShadCN UI components
│   └── course-form.tsx    # Course form component
├── lib/
│   └── mongodb.ts         # MongoDB connection utility
└── models/
    ├── Course.ts          # Mongoose Course model
    └── Student.ts         # Mongoose Student model
```

## Technologies Used

- **Next.js 16** - React framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **ShadCN UI** - UI component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
