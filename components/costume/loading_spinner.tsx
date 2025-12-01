import { Disc3 } from "lucide-react";

export default function LoadingSpinner({size}:{size: string}) {
    return <Disc3 strokeWidth={"2"} className={`animate-spin ${size}`} />
}