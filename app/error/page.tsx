import ErrorIllustration from "@/public/svg/error_illu";

export default function ErrorPage() {
    return (
        <div className="w-screen h-screen bg-background flex items-center justify-center z-20 px-4 absolute">
            {/* SVG Illustration placeholder */}
            <div className="flex items-center justify-center w-72 h-72">
                <ErrorIllustration />
            </div>

            {/* Bottom text */}
            <div className="absolute bottom-12 text-center">
                <p className="text-sm font-semibold dark:text-gray-200 text-gray-700">
                    That's Weird?, Everything gone dark for some reason huh? 
                </p>
                <p className="text-xs">
                    Try closing it and opening it again?
                </p>
            </div>
        </div>
    );
}