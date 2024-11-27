# Birthday Reminder App

A modern, simple birthday reminder application built with Next.js and TypeScript. Keep track of important dates and never forget a birthday again!

## Features

- Add birthdays with names and dates
- View all birthdays in a sorted list
- Delete birthdays you no longer need to track
- Automatic notification for upcoming birthdays (within 30 days)
- Data persistence using local storage
- Clean, modern UI with Tailwind CSS
- Fully responsive design

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form
- date-fns

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Adding a Birthday**
   - Enter the person's name
   - Select their birthday using the date picker
   - Click "Add Birthday"

2. **Viewing Birthdays**
   - All birthdays are displayed in a sorted list
   - Upcoming birthdays (within 30 days) are highlighted at the top

3. **Deleting a Birthday**
   - Click the trash icon next to any birthday to remove it

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
