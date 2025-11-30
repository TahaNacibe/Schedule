import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="w-screen h-screen flex justify-center items-center pb-16 flex-col gap-4">
            <Settings size={45} />
            <h1 className="text-2xl">
                Settings Page
            </h1>
        </div>
    )
}