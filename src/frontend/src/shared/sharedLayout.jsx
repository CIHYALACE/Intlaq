import NavBar from "../components/navBar";

export default function SharedLayout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}