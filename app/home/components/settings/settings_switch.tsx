import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import { JSX } from "react";

export default function SettingsSwitch({ setting, child }
    : { setting: { key: string, label: string, description: string }, child:JSX.Element }) {
    return (
    <div
        key={setting.key}
        className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
        >
        <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{setting.label}</p>
            <p className="text-sm text-muted-foreground">{setting.description}</p>
        </div>
        <div>
        {child}             
        </div>
    </div>
    );
}
