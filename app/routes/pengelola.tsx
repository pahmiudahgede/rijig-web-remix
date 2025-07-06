import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { PengelolaLayoutWrapper } from "~/components/layoutpengelola/layout-wrapper";

export const loader = async () => {
  // Data untuk layout bisa diambil di sini
  return json({
    user: {
      name: "Fahmi Kurniawan",
      email: "pengelola@example.com",
      role: "Pengelola"
    }
  });
};

export default function PengelolaPanelLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <PengelolaLayoutWrapper>
      {/* Outlet akan merender child routes */}
      <Outlet />
    </PengelolaLayoutWrapper>
  );
}