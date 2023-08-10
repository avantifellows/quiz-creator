import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar item1="Quizzing Engine" item2="Live Classes" />
      <main>{children}</main>
    </>
  );
};
export default Layout;
