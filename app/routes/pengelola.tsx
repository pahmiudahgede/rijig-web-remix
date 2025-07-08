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

// pada kode app/routes/pengelola.tsx pada bagian:

export default function PengelolaPanelLayout() {
  const { user } = useLoaderData<LoaderData>();
  return (
    <PengelolaLayoutWrapper user={user}>
      <Outlet />
    </PengelolaLayoutWrapper>
  );
}


/* terdapat error ini: Type '{ children: Element; user: SessionData; }' is not assignable to type 'IntrinsicAttributes & PengelolaLayoutWrapperProps'.
  Property 'user' does not exist on type 'IntrinsicAttributes & PengelolaLayoutWrapperProps'.  */