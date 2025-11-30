import { Disc3 } from "lucide-react";

export default function LoadingSpinner({size}:{size: string}) {
    return <Disc3 className={`animate-spin ${size}`} />
}