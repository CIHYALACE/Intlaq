import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/navBar';
import Footer from '../components/footer';

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
