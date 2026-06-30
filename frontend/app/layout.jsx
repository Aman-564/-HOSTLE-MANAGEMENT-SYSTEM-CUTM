import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "HostelOS | Premium Hostel Management",
  description: "Real-time hostel operations, student services, billing, rooms, and analytics."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
