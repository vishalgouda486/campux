import { adminEmails, facultyEmails } from "./roles";

export function getRole(email: string) {

  if (adminEmails.includes(email)) {
    return "admin";
  }

  if (facultyEmails.includes(email)) {
    return "faculty";
  }

  return "student";
}