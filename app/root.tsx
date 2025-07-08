import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs
} from "@remix-run/node";
import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme
} from "remix-themes";
import { getUserSession, themeSessionResolver } from "./sessions.server";
import { ProgressProvider } from "@bprogress/remix";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  const userSession = await getUserSession(request);

  const sessionData = userSession
    ? {
        accessToken: userSession.accessToken,
        refreshToken: userSession.refreshToken,
        sessionId: userSession.sessionId,
        role: userSession.role,
        deviceId: userSession.deviceId,
        email: userSession.email,
        phone: userSession.phone,
        tokenType: userSession.tokenType,
        registrationStatus: userSession.registrationStatus,
        nextStep: userSession.nextStep
      }
    : null;

  return json({
    sessionData,
    theme: getTheme()
  });
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="id" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <ProgressProvider
          startOnLoad
          color={theme === "dark" ? "#10b981" : "#059669"}
          options={{
            showSpinner: false,
            easing: "ease",
            positionUsing: "",
            template:
              '<div class="bar" role="bar"><div class="peg"></div></div>'
          }}
        >
          <Outlet />
        </ProgressProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
