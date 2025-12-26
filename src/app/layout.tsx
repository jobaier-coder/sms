import "@/styles/globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { YearSelector } from "@/components/layout/year-selector";
import { getAcademicYears, getActiveYearId } from "@/server/year-actions";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "High School Management System",
  description: "Teacher Portal",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const years = await getAcademicYears();
  const activeYearId = await getActiveYearId();

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-slate-50`}>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header Area */}
            <header className="flex h-16 items-center justify-between border-b bg-white px-6">
              <h1 className="text-xl font-semibold text-slate-800">
                School Management
              </h1>
              <YearSelector years={years} activeYearId={activeYearId} />
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
