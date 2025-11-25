import AdminHeader from "@/components/AdminHeader";
import "../globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader />
      <main className="pt-8 px-10">{children}</main>
    </>
  );
}
