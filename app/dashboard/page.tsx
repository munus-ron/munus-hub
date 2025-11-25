import { auth } from "@/auth";

async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1>{session?.user?.name}</h1>
    </div>
  );
}

export default DashboardPage;
