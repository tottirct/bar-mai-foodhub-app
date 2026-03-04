import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const adminItems = [
        {
            icon: "Activity",
            label: "Log",
            href: "/admin"
        },
        {
            icon: "Store",
            label: "Shops",
            href: "/admin/shops"
        },
        {
            icon: "Users",
            label: "Users",
            href: "/admin/users"
        }
    ];

    return (
        <div className="flex h-screen bg-[#FDFDFD] overflow-hidden">
            <Sidebar items={adminItems} />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 md:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}