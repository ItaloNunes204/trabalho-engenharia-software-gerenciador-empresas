import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";

export function SystemTemplate() {
    return (
        <div>
            <Header />

            <main>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
