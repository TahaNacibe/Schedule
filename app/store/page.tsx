import { ShoppingBag } from "lucide-react";

export default function StorePage() {
    return (
        <div className="w-screen h-screen flex justify-center items-center pb-16 flex-col gap-4">
            <ShoppingBag size={45} />
            <h1 className="text-2xl">
                Store Page
            </h1>
        </div>
    )
}