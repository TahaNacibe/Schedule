
interface AuthToggleProps {
    mode: AuthMode;
    onToggle: () => void;
}
// Toggle Component
function AuthToggle({ mode, onToggle }: AuthToggleProps) {
    return (
        <div className="mt-6 text-center">
        <span className="text-muted-foreground">
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button type="button" onClick={onToggle} className="text-primary hover:underline font-medium">
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
        </div>
    );
}


export default AuthToggle