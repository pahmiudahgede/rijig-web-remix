import { redirect } from "@remix-run/node";

export const loader = async () => {
  return redirect("/sys-rijig-adminpanel/dashboard");
};

