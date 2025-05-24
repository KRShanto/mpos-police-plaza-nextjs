import { getUser } from "@/lib/auth";

export default async function Dashboard() {
  const user = await getUser();
  return (
    <div className="p-6">
      <div>{user ? <p>Welcome, {user.name}!</p> : <p>Please log in</p>}</div>
    </div>
  );
}
