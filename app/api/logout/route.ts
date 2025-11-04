import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  // Delete the cookie named "session-token"
  cookieStore.delete("session-token");

  const result = { message: "session token deleted" };
  return new Response(JSON.stringify(result), { status: 200 });
}
