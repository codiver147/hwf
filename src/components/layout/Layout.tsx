
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageSelector } from "./LanguageSelector";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`${isMobile ? '' : 'md:ml-64'}`}>
        <Header />
        <div className="flex justify-end p-4">
          <LanguageSelector />
        </div>
        <main className="p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
