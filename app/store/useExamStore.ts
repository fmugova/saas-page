import { create } from 'zustand';

export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: Date;
}

export interface Grade {
  id: string;
  studentId: string;
  examName: string;
  score: number;
  maxScore: number;
  date: Date;
  subject: string;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  maxScore: number;
  date: Date;
  duration: number;
}

interface ExamStore {
  students: Student[];
  grades: Grade[];
  exams: Exam[];
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addGrade: (grade: Grade) => void;
  updateGrade: (id: string, grade: Partial<Grade>) => void;
  deleteGrade: (id: string) => void;
  addExam: (exam: Exam) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', enrollmentDate: new Date('2024-01-15') },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', enrollmentDate: new Date('2024-01-16') },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', enrollmentDate: new Date('2024-01-17') },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', enrollmentDate: new Date('2024-01-18') },
  { id: '5', name: 'Ethan Hunt', email: 'ethan@example.com', enrollmentDate: new Date('2024-01-19') },
];

const mockExams: Exam[] = [
  { id: '1', name: 'Midterm Exam', subject: 'Mathematics', maxScore: 100, date: new Date('2024-03-15'), duration: 120 },
  { id: '2', name: 'Quiz 1', subject: 'Mathematics', maxScore: 50, date: new Date('2024-02-10'), duration: 45 },
  { id: '3', name: 'Final Exam', subject: 'Physics', maxScore: 100, date: new Date('2024-05-20'), duration: 180 },
  { id: '4', name: 'Lab Test', subject: 'Chemistry', maxScore: 75, date: new Date('2024-04-05'), duration: 90 },
];

const mockGrades: Grade[] = [
  { id: '1', studentId: '1', examName: 'Midterm Exam', score: 85, maxScore: 100, date: new Date('2024-03-15'), subject: 'Mathematics' },
  { id: '2', studentId: '1', examName: 'Quiz 1', score: 45, maxScore: 50, date: new Date('2024-02-10'), subject: 'Mathematics' },
  { id: '3', studentId: '2', examName: 'Midterm Exam', score: 78, maxScore: 100, date: new Date('2024-03-15'), subject: 'Mathematics' },
  { id: '4', studentId: '2', examName: 'Final Exam', score: 88, maxScore: 100, date: new Date('2024-05-20'), subject: 'Physics' },
  { id: '5', studentId: '3', examName: 'Quiz 1', score: 42, maxScore: 50, date: new Date('2024-02-10'), subject: 'Mathematics' },
  { id: '6', studentId: '3', examName: 'Lab Test', score: 65, maxScore: 75, date: new Date('2024-04-05'), subject: 'Chemistry' },
  { id: '7', studentId: '4', examName: 'Midterm Exam', score: 92, maxScore: 100, date: new Date('2024-03-15'), subject: 'Mathematics' },
  { id: '8', studentId: '4', examName: 'Final Exam', score: 95, maxScore: 100, date: new Date('2024-05-20'), subject: 'Physics' },
  { id: '9', studentId: '5', examName: 'Quiz 1', score: 38, maxScore: 50, date: new Date('2024-02-10'), subject: 'Mathematics' },
  { id: '10', studentId: '5', examName: 'Lab Test', score: 70, maxScore: 75, date: new Date('2024-04-05'), subject: 'Chemistry' },
];

export const useExamStore = create<ExamStore>((set) => ({
  students: mockStudents,
  grades: mockGrades,
  exams: mockExams,

  addStudent: (student) => set((state) => ({
    students: [...state.students, student]
  })),

  updateStudent: (id, studentUpdate) => set((state) => ({
    students: state.students.map((s) =>
      s.id === id ? { ...s, ...studentUpdate } : s
    )
  })),

  deleteStudent: (id) => set((state) => ({
    students: state.students.filter((s) => s.id !== id),
    grades: state.grades.filter((g) => g.studentId !== id)
  })),

  addGrade: (grade) => set((state) => ({
    grades: [...state.grades, grade]
  })),

  updateGrade: (id, gradeUpdate) => set((state) => ({
    grades: state.grades.map((g) =>
      g.id === id ? { ...g, ...gradeUpdate } : g
    )
  })),

  deleteGrade: (id) => set((state) => ({
    grades: state.grades.filter((g) => g.id !== id)
  })),

  addExam: (exam) => set((state) => ({
    exams: [...state.exams, exam]
  })),

  updateExam: (id, examUpdate) => set((state) => ({
    exams: state.exams.map((e) =>
      e.id === id ? { ...e, ...examUpdate } : e
    )
  })),

  deleteExam: (id) => set((state) => ({
    exams: state.exams.filter((e) => e.id !== id)
  })),
}));
