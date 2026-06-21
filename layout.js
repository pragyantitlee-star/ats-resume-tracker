import './globals.css';

export const metadata = {
  title: 'ATS Resume Tracker',
  description: 'Track ATS compatibility of your resume across versions and job descriptions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
