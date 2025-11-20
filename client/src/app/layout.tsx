import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "../context/ThemeContext";
import { UserProvider } from "../context/UserContext";

import "./globals.css";

export const metadata: Metadata = {
  title: "Update Hub",
  description: "Enterprise SaaS Data Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ThemeProvider>
            <UserProvider>{children}</UserProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
