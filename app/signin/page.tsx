"use client"
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import AuthForm from "./components/auth_form";
import AuthHeader from "./components/header";
import AuthToggle from "./components/auth_toggle";
import IllustrationPanel from "./components/illustration_panel";
import { handleSignInWithEmailAndPassword, handleSignUpWithEmailAndPassword } from "@/services/auth_services";
import { auth } from "@/lib/firebase";
import { useProfile } from "@/contexts/ProfileContext";
import costumeToast from "@/components/costume/costume_toast";
import { useRouter } from 'next/navigation';


interface FormData {
    email: string;
    password: string;
    repassed: string;
    displayName: string;
}


export default function AuthPage() {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        repassed: "",
        displayName: ""
    });
    const { updateAuthState, updateCurrentUser } = useProfile();
    const router = useRouter();


    const handleSubmit = async (): Promise<void> => {
        if (formData.password != formData.repassed && mode === "signup") {
            costumeToast({content:"Password Doesn't match", type:"ERROR"})
            return;
        }


        setIsLoading(true)
        let response;
        if (mode === "signin") {
            response = await handleSignInWithEmailAndPassword({
                auth,email:formData.email, password:formData.password
            })
        } else {
            response = await handleSignUpWithEmailAndPassword({
                auth,email:formData.email, password:formData.password, displayName:formData.displayName
            })
        }
        // update profile copy locally
        if (response.success) {
            updateAuthState(true);
            updateCurrentUser(response.data as Profile)
            router.push('/');
        }

        costumeToast({content:response.message, type:"ERROR"})
        setIsLoading(false)
    };

    const handleInputChange = (field: keyof FormData, value: string): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleMode = (): void => {
        setMode(prev => prev === 'signin' ? 'signup' : 'signin');
        setFormData({ email: '', password: '', repassed: "", displayName:""});
    };

    return (
        <div className="w-screen h-screen flex overflow-hidden pl-6">
        {/* Form Section - Switches sides based on mode */}
        <div className={`w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out ${
            mode === 'signin' ? 'translate-x-0' : 'translate-x-full'
        }`}>
            <Card className="w-full h-screen flex justify-center shadow-xl border-0 pl-4">
            <AuthHeader mode={mode} />
            <CardContent className="px-8 pb-8">
                <AuthForm
                mode={mode}
                formData={formData}
                showPassword={showPassword}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleSubmit}
                />
                <AuthToggle mode={mode} onToggle={toggleMode} />
            </CardContent>
            </Card>
        </div>

        {/* Illustration Section - Switches sides based on mode */}
        <div className={`w-1/2 h-screen transition-all duration-700 ease-in-out ${
            mode === 'signin' ? 'translate-x-0' : '-translate-x-full'
        }`}>
            <IllustrationPanel mode={mode} />
        </div>
        </div>
    );
}