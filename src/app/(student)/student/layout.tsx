import StudentSidebar from "../../components/StudentSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-[#f5f7fb]">

      <StudentSidebar />

      <section className="flex-1 p-5 md:p-10 mt-20 md:mt-0">
        {children}
      </section>

    </main>
  );
}