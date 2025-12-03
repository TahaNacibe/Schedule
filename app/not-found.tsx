"use client"
import { Button } from "@/components/ui/button";
import NotFoundIllustration from "@/public/svg/not_found_illu";
import { Home } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
    const router = useRouter();

    return (<div className="w-screen h-screen bg-background flex items-center justify-center z-20 px-4 absolute">
            {/* SVG Illustration placeholder */}
            <div className="flex items-center justify-center w-60 h-60">
                <NotFoundIllustration />
            </div>

            {/* Bottom text */}
            <div className="absolute bottom-8 text-center">
                <p className="text-sm font-semibold dark:text-gray-200 text-gray-700">
                    Well! There's nothing here no matter how do you look to it it's empty
                </p>
                <p className="text-xs">
                    Just jump back to the start
            </p>
            <Button
                onClick={() => {
                    router.push('/');
                }}
                className="mt-6">
                <Home className="text-background!" />
                Go Home
            </Button>
            </div>
        </div>)
}