import { LoaderPinwheel } from "lucide-react";

export default function LoadingPinWheel({size}:{size: string}) {
    return <LoaderPinwheel strokeWidth={1} className={`animate-spin ${size}`} />
}