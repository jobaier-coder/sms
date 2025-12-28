import "@/styles/globals.css";
import { ClientLayout } from "@/components/layout/client-layout";
import { getAcademicYears, getActiveYearId } from "@/server/year-actions";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Gachihata Palli Academy",
  description: "School Management System",
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
        <ClientLayout years={years} activeYearId={activeYearId}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
