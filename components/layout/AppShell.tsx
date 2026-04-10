import Sidebar from './Sidebar';
import TopNav from './TopNav';

interface AppShellProps {
  children: React.ReactNode;
  breadcrumb?: string;
}

export default function AppShell({ children, breadcrumb }: AppShellProps) {
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav breadcrumb={breadcrumb} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
