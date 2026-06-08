import { POST } from "./src/app/api/timetable/create/route";

async function run() {
  console.log("Starting timetable generation...");
  const response = await POST();
  const data = await response.json();
  console.log("Timetable Generation Complete!");
  console.log("Success Status:", data.success);
  console.log("Message:", data.message);
  if (data.validation) {
    console.log("Unscheduled Count:", data.validation.unscheduled.length);
    console.log("Faculty Clashes Count:", data.validation.facultyClashes.length);
    console.log("Room Clashes Count:", data.validation.roomClashes.length);
    if (data.validation.unscheduled.length > 0) {
      console.log("Unscheduled details:", data.validation.unscheduled);
    }
  }
}

run().catch(console.error);
