import FacultySidebar from "../../components/FacultySidebar";

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-[#f5f7fb]">

      <FacultySidebar />

      <section className="flex-1 p-6 md:p-10">
        {children}
      </section>

    </main>
  );
}