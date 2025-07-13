import NavBar from "../components/navBar";
import { Outlet } from "react-router-dom";

export default function SharedLayout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}