import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { PengelolaLayoutWrapper } from "~/components/layoutpengelola/layout-wrapper";
import { requireUserSession, SessionData } from "~/sessions.server";

interface LoaderData {
  user: SessionData;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await requireUserSession(
    request,
    "pengelola",
    "complete"
  );

  return json<LoaderData>({
    user: userSession
  });
}

export default function PengelolaPanelLayout() {
  const { user } = useLoaderData<LoaderData>();
  return (
    <PengelolaLayoutWrapper user={user}>
      <Outlet />
    </PengelolaLayoutWrapper>
  );
}
