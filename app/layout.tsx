import type { Metadata } from "next";
import "./globals.css";
import SidebarLayout from "@/components/SidebarLayout";
import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: "FiveMaker",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <ToastProvider>
          <ThemeProvider>
            <body>
              <SidebarLayout>{children}</SidebarLayout>
            </body>
          </ThemeProvider>
        </ToastProvider>
      </ClerkProvider>
    </html>
  );
}
