"use client"
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader, Mail } from "lucide-react";
import React, { useState, useEffect, Fragment } from "react";
import { auth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, getAdditionalUserInfo } from '@/firebase/config';
import { addDocument } from "@/firebase/service";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    useEffect(() => {
        validateEmail();
    }, [email]);

    useEffect(() => {
        validatePassword();
    }, [password]);

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("");
        } else if (!emailRegex.test(email)) {
            setEmailError("Invalid email format");
        } else {
            setEmailError("");
        }
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError("");
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
        } else {
            setPasswordError("");
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailError && !passwordError) {
            setIsLoading(true);
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                if (error.code === 'auth/too-many-requests') {
                    toast({
                        variant: "warning",
                        title: "Tài khoản bị khoá tạm thời!"
                    })
                }
                toast({
                    variant: "destructive",
                    title: "Lỗi đăng nhập!"
                })
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const providerGoogle = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, providerGoogle);
            const { user, providerId } = result;
            const details = getAdditionalUserInfo(result)
            if (details.isNewUser) {
                await addDocument('users', {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    providerId,
                    uid: user.uid
                })
            }
        } catch (error) {
            console.error("Error during login: ", error);
        }
    }

    return (
        <Fragment>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md transform transition-all duration-300 ease-in-out">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${emailError ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out`}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    aria-invalid={emailError ? "true" : "false"}
                                    aria-describedby="email-error"
                                />
                            </div>
                            {emailError && (
                                <p className="mt-2 text-sm text-red-600" id="email-error">
                                    {emailError}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`appearance-none block w-full px-3 py-2 border ${passwordError ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    aria-invalid={passwordError ? "true" : "false"}
                                    aria-describedby="password-error"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff strokeWidth={1.5} absoluteStrokeWidth className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    ) : (
                                        <Eye strokeWidth={1.5} absoluteStrokeWidth className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="mt-2 text-sm text-red-600" id="password-error">
                                    {passwordError}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                type="submit"
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader strokeWidth={1.5} absoluteStrokeWidth className="animate-spin h-5 w-5 mr-3" />
                                ) : (
                                    'Login'
                                )}
                            </button>
                            <Button className="py-2 px-4 h-10" onClick={handleLogin}>
                                <Mail className="mr-2 h-4 w-4" /> Login with Google
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>

    );
};

export default LoginPage;