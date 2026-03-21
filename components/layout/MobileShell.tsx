import Header from "./Header";
import BottomNav from "./BottomNav";

export default function MobileShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
