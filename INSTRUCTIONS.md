# Exam Dashboard and Gradebook - Complete Setup Instructions

## Project Overview

This is a comprehensive exam dashboard and gradebook web application built with Next.js, React, TypeScript, and Tailwind CSS. It provides a complete solution for managing student assessments, tracking performance, and analyzing exam results.

## Features

- **Dashboard Overview**: Visual analytics with charts showing exam performance trends
- **Student Management**: Add, edit, and track student information
- **Exam Management**: Create and manage exams with subjects and dates
- **Grade Book**: Record and track student grades with automatic percentage calculations
- **Data Export**: Export all data to Excel spreadsheets
- **Performance Analytics**:
  - Bar charts for exam scores
  - Line charts for performance trends
  - Pie charts for grade distribution
  - Statistical summaries

## Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Export**: XLSX
- **Date Handling**: date-fns

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)

To check your versions:
```bash
node --version
npm --version
```

## Installation Instructions

### Step 1: Extract the Project

Extract the zip file to your desired location on your computer.

### Step 2: Navigate to Project Directory

Open your terminal/command prompt and navigate to the project folder:

```bash
cd path/to/exam-dashboard-gradebook
```

### Step 3: Install Dependencies

Install all required packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`.

### Step 4: Start Development Server

Run the development server:

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Step 5: Open in Browser

Open your web browser and navigate to:
```
http://localhost:3000
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`
- Runs the app in development mode
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser
- The page will reload if you make edits

### `npm run build`
- Builds the app for production to the `.next` folder
- Optimizes the build for best performance

### `npm start`
- Runs the built app in production mode
- Must run `npm run build` first

### `npm run lint`
- Runs the Next.js linter to check code quality

## Project Structure

```
exam-dashboard-gradebook/
├── app/                          # Next.js app directory
│   ├── components/               # React components (empty - components in main files)
│   ├── store/                    # State management
│   │   └── useExamStore.ts      # Zustand store for exam data
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main dashboard page
├── .next/                        # Next.js build output (auto-generated)
├── node_modules/                 # Dependencies (auto-generated)
├── .gitignore                    # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── README.md                    # Project description
└── INSTRUCTIONS.md              # This file
```

## How to Use the Application

### Dashboard Overview Tab
- View summary statistics (total students, exams, grades, average score)
- See visual charts of exam performance
- Monitor performance trends over time
- View grade distribution

### Students Tab
- Add new students with name and email
- View list of all enrolled students
- See enrollment dates
- Delete student records (with confirmation)

### Grades Tab
- Add new grades for students
- Select student, exam, and enter scores
- Automatic percentage calculation
- View complete gradebook with all entries
- Filter and sort grades
- Delete grade entries

### Exams Tab
- Create new exams
- Specify exam name, subject, and date
- View all scheduled exams
- Delete exams (with confirmation)

### Data Export
- Click "Export to Excel" button (available on all tabs)
- Downloads a comprehensive Excel file with:
  - Students sheet
  - Grades sheet
  - Exams sheet
- File is saved as `exam-gradebook-export.xlsx`

## Customization

### Modifying Subjects
To add or modify available subjects, edit the subjects array in `/app/page.tsx`:

```typescript
const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];
```

### Styling
- Global styles: Edit `/app/globals.css`
- Component styles: Uses Tailwind CSS utility classes
- Tailwind config: Modify `/tailwind.config.js`

### Adding Features
The application uses Zustand for state management. To add new features:
1. Update the store in `/app/store/useExamStore.ts`
2. Add UI components in `/app/page.tsx`
3. Connect to the store using hooks

## Data Persistence

**Important Note**: Currently, data is stored in memory and will be reset when the page is refreshed. To add persistence:

1. **Local Storage**: Add localStorage sync to the Zustand store
2. **Database**: Integrate with a backend API (Firebase, Supabase, etc.)
3. **File System**: Use Next.js API routes with file system storage

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
npm run dev -- -p 3001
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Build Errors
```bash
# Clean the build directory
rm -rf .next

# Rebuild
npm run build
```

## Browser Compatibility

The application works best on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

For production deployment:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## Deployment Options

### Vercel (Recommended for Next.js)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy with one click

### Other Platforms
- **Netlify**: Supports Next.js
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment
- **Traditional Hosting**: Build static export

## Support and Documentation

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Recharts**: https://recharts.org
- **Zustand**: https://github.com/pmndrs/zustand

## License

This project is provided as-is for educational and commercial use.

## Version History

- **v1.0.0** (2024): Initial release with core features
  - Student management
  - Exam tracking
  - Gradebook functionality
  - Excel export
  - Performance analytics

## Future Enhancements (Suggested)

- Add data persistence (localStorage or database)
- User authentication and authorization
- Multiple teacher/admin accounts
- Student portal for viewing own grades
- Email notifications for grades
- Advanced filtering and search
- Grade curve calculations
- Attendance tracking
- Report card generation
- Mobile responsive improvements
- Dark mode theme
- Multi-language support

---

**Need Help?**

If you encounter any issues during setup or usage:
1. Check this documentation thoroughly
2. Review the error messages in the browser console
3. Check the terminal for build errors
4. Ensure all dependencies are properly installed
5. Verify Node.js and npm versions meet requirements

**Happy Teaching and Grading!**
