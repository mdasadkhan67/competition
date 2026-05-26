import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function PublicLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sticky Navigation */}
            <Header />

            {/* Main Content Area */}
            <main className="flex-grow pt-20">
                <Outlet />
            </main>

            {/* Portal Footer */}
            <Footer />
        </div>
    );
}
