import { SignIn } from "@clerk/nextjs";

export default function Page() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">

      <SignIn
        forceRedirectUrl="/redirect"
      />

    </div>
  );
}