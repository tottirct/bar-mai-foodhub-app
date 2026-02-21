// src/app/customer/layout.tsx
import Sidebar from "@/components/customer/Sidebar";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Fixed sidebar */}
            <Sidebar />

            {/* Main content area — scrollable */}
            <div className="flex-1 h-screen overflow-y-auto">
                {children}
            </div>
        </div>
    );
}