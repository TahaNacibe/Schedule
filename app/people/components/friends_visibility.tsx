import { LucideIcon } from "lucide-react";
import { JSX } from "react";

export default function ListDisplayPlaceHolder({ title, Icon }
    : { title: JSX.Element; Icon: LucideIcon }) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="rounded-full bg-accent p-6">
                        <Icon className="text-gray-400" size={38} strokeWidth={1.5} />
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600">
                        {title}
                    </h3>
                </div>
            </div>
        </div>
    )
}