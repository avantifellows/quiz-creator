import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar item1="Quizzing Engine" item2="Live Classes" />
      <main>{children}</main>
    </>
  );
};
export default Layout;
