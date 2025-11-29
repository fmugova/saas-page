'use client';

import { useState } from 'react';
import { useExamStore } from './store/useExamStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, TrendingUp, Calendar, Download, Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

export default function ExamDashboard() {
  const { students, grades, exams } = useExamStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'grades' | 'exams'>('overview');

  const calculateStats = () => {
    const totalStudents = students.length;
    const totalExams = exams.length;
    const totalGrades = grades.length;
    const averageScore = grades.length > 0
      ? (grades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / grades.length).toFixed(1)
      : '0';

    return { totalStudents, totalExams, totalGrades, averageScore };
  };

  const stats = calculateStats();

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const studentsData = students.map(s => ({
      Name: s.name,
      Email: s.email,
      'Enrollment Date': format(s.enrollmentDate, 'yyyy-MM-dd')
    }));
    const wsStudents = XLSX.utils.json_to_sheet(studentsData);
    XLSX.utils.book_append_sheet(wb, wsStudents, 'Students');

    const gradesData = grades.map(g => {
      const student = students.find(s => s.id === g.studentId);
      return {
        Student: student?.name || 'Unknown',
        Exam: g.examName,
        Subject: g.subject,
        Score: g.score,
        'Max Score': g.maxScore,
        Percentage: ((g.score / g.maxScore) * 100).toFixed(1) + '%',
        Date: format(g.date, 'yyyy-MM-dd')
      };
    });
    const wsGrades = XLSX.utils.json_to_sheet(gradesData);
    XLSX.utils.book_append_sheet(wb, wsGrades, 'Grades');

    const examsData = exams.map(e => ({
      Name: e.name,
      Subject: e.subject,
      'Max Score': e.maxScore,
      Date: format(e.date, 'yyyy-MM-dd'),
      'Duration (min)': e.duration
    }));
    const wsExams = XLSX.utils.json_to_sheet(examsData);
    XLSX.utils.book_append_sheet(wb, wsExams, 'Exams');

    XLSX.writeFile(wb, 'exam-dashboard-export.xlsx');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Exam Dashboard & Gradebook</h1>
              <p className="text-slate-300">Comprehensive student performance tracking system</p>
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Download size={20} />
              Export to Excel
            </button>
          </div>
        </header>

        <div className="mb-6 flex gap-4 border-b border-slate-700">
          {['overview', 'students', 'grades', 'exams'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab stats={stats} students={students} grades={grades} exams={exams} />}
        {activeTab === 'students' && <StudentsTab students={students} grades={grades} />}
        {activeTab === 'grades' && <GradesTab grades={grades} students={students} />}
        {activeTab === 'exams' && <ExamsTab exams={exams} />}
      </div>
    </div>
  );
}

function OverviewTab({ stats, students, grades, exams }: any) {
  const subjectData = grades.reduce((acc: any, grade: any) => {
    const existing = acc.find((item: any) => item.subject === grade.subject);
    if (existing) {
      existing.totalScore += grade.score;
      existing.totalMax += grade.maxScore;
      existing.count += 1;
    } else {
      acc.push({
        subject: grade.subject,
        totalScore: grade.score,
        totalMax: grade.maxScore,
        count: 1
      });
    }
    return acc;
  }, []).map((item: any) => ({
    subject: item.subject,
    average: ((item.totalScore / item.totalMax) * 100).toFixed(1)
  }));

  const performanceData = students.map((student: any) => {
    const studentGrades = grades.filter((g: any) => g.studentId === student.id);
    const avg = studentGrades.length > 0
      ? (studentGrades.reduce((acc: number, g: any) => acc + (g.score / g.maxScore) * 100, 0) / studentGrades.length).toFixed(1)
      : 0;
    return {
      name: student.name.split(' ')[0],
      score: parseFloat(avg.toString())
    };
  });

  const gradeDistribution = [
    { name: 'A (90-100)', value: grades.filter((g: any) => (g.score / g.maxScore) * 100 >= 90).length },
    { name: 'B (80-89)', value: grades.filter((g: any) => {
      const pct = (g.score / g.maxScore) * 100;
      return pct >= 80 && pct < 90;
    }).length },
    { name: 'C (70-79)', value: grades.filter((g: any) => {
      const pct = (g.score / g.maxScore) * 100;
      return pct >= 70 && pct < 80;
    }).length },
    { name: 'D (60-69)', value: grades.filter((g: any) => {
      const pct = (g.score / g.maxScore) * 100;
      return pct >= 60 && pct < 70;
    }).length },
    { name: 'F (<60)', value: grades.filter((g: any) => (g.score / g.maxScore) * 100 < 60).length },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#991b1b'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Total Students" value={stats.totalStudents} color="bg-blue-600" />
        <StatCard icon={BookOpen} title="Total Exams" value={stats.totalExams} color="bg-purple-600" />
        <StatCard icon={Calendar} title="Total Grades" value={stats.totalGrades} color="bg-green-600" />
        <StatCard icon={TrendingUp} title="Average Score" value={`${stats.averageScore}%`} color="bg-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Performance by Subject</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="subject" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="average" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Student Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">Grade Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={gradeDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {gradeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StudentsTab({ students, grades }: any) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Student Management</h2>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={20} />
          Add Student
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Name</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Email</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Enrollment Date</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Exams Taken</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Avg Score</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => {
              const studentGrades = grades.filter((g: any) => g.studentId === student.id);
              const avgScore = studentGrades.length > 0
                ? (studentGrades.reduce((acc: number, g: any) => acc + (g.score / g.maxScore) * 100, 0) / studentGrades.length).toFixed(1)
                : 'N/A';

              return (
                <tr key={student.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 text-white">{student.name}</td>
                  <td className="py-3 px-4 text-slate-300">{student.email}</td>
                  <td className="py-3 px-4 text-slate-300">{format(student.enrollmentDate, 'MMM dd, yyyy')}</td>
                  <td className="py-3 px-4 text-slate-300">{studentGrades.length}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      avgScore === 'N/A' ? 'text-slate-400' :
                      parseFloat(avgScore) >= 90 ? 'text-green-400' :
                      parseFloat(avgScore) >= 80 ? 'text-blue-400' :
                      parseFloat(avgScore) >= 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {avgScore !== 'N/A' ? `${avgScore}%` : avgScore}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GradesTab({ grades, students }: any) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Grade Book</h2>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={20} />
          Add Grade
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Student</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Exam</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Subject</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Score</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Percentage</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Date</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade: any) => {
              const student = students.find((s: any) => s.id === grade.studentId);
              const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);

              return (
                <tr key={grade.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 text-white">{student?.name || 'Unknown'}</td>
                  <td className="py-3 px-4 text-slate-300">{grade.examName}</td>
                  <td className="py-3 px-4 text-slate-300">{grade.subject}</td>
                  <td className="py-3 px-4 text-slate-300">{grade.score}/{grade.maxScore}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      parseFloat(percentage) >= 90 ? 'text-green-400' :
                      parseFloat(percentage) >= 80 ? 'text-blue-400' :
                      parseFloat(percentage) >= 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{format(grade.date, 'MMM dd, yyyy')}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExamsTab({ exams }: any) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Exam Management</h2>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={20} />
          Add Exam
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam: any) => (
          <div key={exam.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-purple-500 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{exam.name}</h3>
                <p className="text-sm text-purple-400">{exam.subject}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Edit2 size={18} />
                </button>
                <button className="text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Max Score:</span>
                <span className="text-white font-semibold">{exam.maxScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="text-white">{exam.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="text-white">{format(exam.date, 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }: any) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}
