import { Zap, Shield, Layers } from "lucide-react";

type AuthMode = 'signin' | 'signup';

interface IllustrationPanelProps {
    mode: AuthMode;
}

function IllustrationPanel({ mode }: IllustrationPanelProps) {
    return (
        <div className="relative flex flex-col justify-center p-16 h-screen overflow-hidden transition-colors duration-700 bg-linear-to-br from-gray-50 via-gray-100 to-white text-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-white">
            {/* Light reflection effect */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Main reflection beam */}
                <div className="absolute top-0 right-0 w-[600px] h-full blur-3xl transform rotate-12 transition-opacity duration-700 bg-linear-to-bl from-gray-900/20 via-gray-900/5 to-transparent opacity-60 dark:from-white/20 dark:via-white/5 dark:to-transparent"></div>
                
                {/* Secondary softer glow */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px] transition-opacity duration-700 bg-gray-900/10 dark:bg-white/10"></div>
                
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] blur-3xl transition-opacity duration-700 bg-linear-to-tr from-gray-900/10 via-gray-900/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-xl">
                {/* Main heading */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold mb-4 leading-tight transition-colors duration-700 text-gray-900 dark:text-white">
                        {mode === 'signin' 
                            ? 'Good to See You!' 
                            : 'Ready to Join?'}
                    </h1>
                    <p className="text-xl transition-colors duration-700 text-gray-600 dark:text-gray-300">
                        {mode === 'signin'
                            ? 'Continue where you left off and access all your personalized content.'
                            : 'Create your account and unlock powerful tools designed for productivity.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default IllustrationPanel;