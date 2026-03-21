import Header from "./Header";
import BottomNav from "./BottomNav";

export default function MobileShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pb-14">{children}</main>
      <BottomNav />
    </div>
  );
}
