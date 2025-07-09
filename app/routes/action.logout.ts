import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions.server";
import commonAuthService from "~/services/auth/common.service";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request);

  try {
    await commonAuthService.logout();
  } catch (error) {
    console.error("Logout API error:", error);
  }

  commonAuthService.removeAuthToken();

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
};

export const loader = async () => {
  throw new Response("Not Found", { status: 404 });
};
