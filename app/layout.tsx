import './globals.css'

export const metadata = {
  title: 'Exam Dashboard & Gradebook',
  description: 'Comprehensive exam dashboard and gradebook system for managing student assessments and performance tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}