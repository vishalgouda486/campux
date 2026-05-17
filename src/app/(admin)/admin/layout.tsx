import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-[#f5f7fb]">

      <AdminSidebar />

      <section className="flex-1 p-6 md:p-10">
        {children}
      </section>

    </main>
  );
}