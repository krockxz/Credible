import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RESUME AUDIT | Get Roasted by AI",
  description: "Brutally honest resume analysis. Upload your resume, paste the job description, get actionable feedback. No sugarcoating.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
