import NavBar from "../components/navBar";
import Footer from "../components/footer";
import { Outlet } from "react-router-dom";

export default function SharedLayout() {
    return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
    )
}