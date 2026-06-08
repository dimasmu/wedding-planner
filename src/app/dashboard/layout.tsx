import { Sidebar } from "@/components/ui-custom/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 bg-brand-cream min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
