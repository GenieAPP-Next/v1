import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genie",
  description: "Effortlessly manage gift",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
