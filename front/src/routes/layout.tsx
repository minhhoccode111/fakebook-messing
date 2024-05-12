import { Outlet } from "react-router-dom";

import ThemeProvider from "@/components/theme-provider";

import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";

const Layout = () => {
  return (
    // wrapper to change root classes each time theme changes
    <ThemeProvider>
      <div
        id="wrapper"
        className="flex flex-1 flex-col gap-2 p-4 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
      >
        <Header />

        <main className="flex-1 flex flex-col gap-2">
          <Outlet></Outlet>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
