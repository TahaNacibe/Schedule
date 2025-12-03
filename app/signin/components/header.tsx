import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface AuthHeaderProps {
    mode: AuthMode;
}
// Header Component
function AuthHeader({ mode }: AuthHeaderProps) {
    return (
        <CardHeader className="space-y-1 pb-6 pt-12">
        <CardTitle className="text-3xl font-bold text-center">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-center text-base">
            {mode === 'signin' 
            ? 'Sign in to your account to continue' 
            : 'Create an account to get started'}
        </CardDescription>
        </CardHeader>
    );
}

export default AuthHeader