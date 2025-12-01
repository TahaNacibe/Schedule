import { LucideIcon } from "lucide-react";

export default function EmptyListPlaceHolder({ list_name, Icon }: { list_name: string;  Icon:LucideIcon}) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="rounded-full bg-accent p-6">
                        <Icon className="text-gray-400" size={48} strokeWidth={1.5} />
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">
                        No {list_name} here?
                    </h3>
                    <p className="text-sm text-gray-400">
                        Feel very empty in here (o_o)
                    </p>
                </div>
            </div>
        </div>
    )
}