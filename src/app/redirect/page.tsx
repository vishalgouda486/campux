import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import { getRole } from "@/lib/getRole";

export default async function RedirectPage() {

  const user = await currentUser();

  if (!user || !user.emailAddresses[0]) {
    redirect("/sign-in");
  }

  const email = user.emailAddresses[0].emailAddress;

  const role = getRole(email);

  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "faculty") {
    redirect("/faculty");
  }

  redirect("/student");
}