# Course Enrollment Dashboard

A Next.js dashboard application for managing courses with WhatsApp group integration. Built with Next.js, MongoDB, Mongoose, and ShadCN UI.

## Features

- ✅ Full CRUD operations for courses
- ✅ MongoDB integration with Mongoose
- ✅ WhatsApp group selector with dropdown
- ✅ Form validation with Zod and React Hook Form
- ✅ Beautiful UI with ShadCN components
- ✅ Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- WhatsApp API access (optional, for group selection)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection URI
MONGODB_URI=your_mongodb_connection_string_here

# WhatsApp API Configuration (Optional)
# If not provided, defaults will be used from the guide
WHATSAPP_API_ENDPOINT=http://178.18.245.131:3000/api/default/groups
WHATSAPP_API_KEY=your_whatsapp_api_key_here
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

### Creating a Course

1. Click the "Add Course" button
2. Enter a course name
3. Select a WhatsApp group from the dropdown (or enter the chat ID manually)
4. Click "Save"

### Editing a Course

1. Click the pencil icon next to the course you want to edit
2. Modify the course name or WhatsApp group
3. Click "Save"

### Deleting a Course

1. Click the trash icon next to the course you want to delete
2. Confirm the deletion in the dialog

## Project Structure

```
course-enrollment/
├── app/
│   ├── api/
│   │   ├── courses/        # Course CRUD API routes
│   │   └── groups/         # WhatsApp groups API proxy
│   ├── page.tsx           # Main dashboard page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                 # ShadCN UI components
│   └── course-form.tsx    # Course form component
├── lib/
│   └── mongodb.ts         # MongoDB connection utility
└── models/
    └── Course.ts          # Mongoose Course model
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
