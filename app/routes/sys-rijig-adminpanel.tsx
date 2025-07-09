import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { AdminLayoutWrapper } from "~/components/layoutadmin/layout-wrapper";
import { requireUserSession, SessionData } from "~/sessions.server";

interface LoaderData {
  user: SessionData;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await requireUserSession(
    request,
    "administrator",
    "complete"
  );

  return json<LoaderData>({
    user: userSession
  });
}

export default function AdminPanelLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <AdminLayoutWrapper user={user}>
      <Outlet />
    </AdminLayoutWrapper>
  );
}
