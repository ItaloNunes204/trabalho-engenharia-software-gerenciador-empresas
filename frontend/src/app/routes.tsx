import { Routes, Route } from "react-router-dom";
import { SystemTemplate } from "../shared/layouts/SystemTemplate";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<div>Home</div>} />

            <Route path="/login" element={<div>Login</div>} />
            <Route path="/record" element={<div>Record</div>} />

            <Route element={<SystemTemplate />}>
                <Route path="/user" element={<div>Home</div>} />
            </Route>
        </Routes>
    );
}
