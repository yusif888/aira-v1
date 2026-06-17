import { Head } from "@inertiajs/react";

export default function InfrastrukturLayout({ children }) {
    return (
        <>
            <Head title="SISDA" />
            <div className="min-h-screen flex flex-col">
                <main className="flex-1">{children}</main>
            </div>
        </>
    );
}
