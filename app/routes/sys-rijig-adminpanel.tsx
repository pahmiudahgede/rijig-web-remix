import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { AdminLayoutWrapper } from "~/components/layoutadmin/layout-wrapper";

export const loader = async () => {
  // Data untuk layout bisa diambil di sini
  return json({
    user: {
      name: "Musharof",
      email: "admin@example.com",
      role: "Administrator"
    }
  });
};

export default function AdminPanelLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <AdminLayoutWrapper>
      {/* Outlet akan merender child routes */}
      <Outlet />
    </AdminLayoutWrapper>
  );
}