import LoadingPinWheel from "@/components/costume/spinner_wheel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, EyeOff, Eye, Lock, User } from "lucide-react";


interface FormData {
    email: string;
    password: string;
    repassed: string;
    displayName: string;
}

interface AuthFormProps {
    mode: AuthMode;
    formData: FormData;
    showPassword: boolean;
    isLoading: boolean;
    onInputChange: (field: keyof FormData, value: string) => void;
    onTogglePassword: () => void;
    onSubmit: () => void;
}

// Form Component
function AuthForm({ mode, formData, showPassword, isLoading ,onInputChange, onTogglePassword, onSubmit }: AuthFormProps) {
    return (
        <div className="space-y-5">
        {mode ===  "signup" && <div className="space-y-2">
            <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
                id="name"
                type="text"
                placeholder="jane doe"
                value={formData.displayName}
                onChange={(e) => onInputChange('displayName', e.target.value)}
                className="pl-10 h-12 text-base"
            />
            </div>
        </div>}
        <div className="space-y-2">
            {mode === 'signin' && <Label htmlFor="email" className="text-base">Email</Label>}
            <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className="pl-10 h-12 text-base"
            />
            </div>
        </div>

        <div className="space-y-2">
            {mode === 'signin' && <Label htmlFor="password" className="text-base">Password</Label>}
            <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => onInputChange('password', e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
            />
            <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
            >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            </div>
            </div>
            
        {mode === "signup" && <div className="space-y-2">
            <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.repassed}
                onChange={(e) => onInputChange('repassed', e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
            />
            <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
            >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            </div>
        </div>}

        {mode === 'signin' && (
            <div className="flex justify-end">
            <button type="button" className="text-sm text-primary hover:underline">
                Forgot password?
            </button>
            </div>
        )}

            <Button
                disabled={isLoading}
                onClick={onSubmit} className="w-full h-12 text-base">
                {isLoading
                    ? <div className="flex gap-2 items-center">
                        <LoadingPinWheel size="w-6! h-6! dark:text-black! text-white!" />
                        Working on it...
                    </div>
                    : <div>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</div>
                }
        </Button>
        </div>
    );
}


export default AuthForm