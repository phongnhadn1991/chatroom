"use client"
import { createContext, useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { useRouter } from 'next-nprogress-bar';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Toaster } from '@/components/ui/toaster';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter()
    const [user, setUser] = useState('' || {});
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const { displayName, email, uid, photoURL } = currentUser
                setUser({ displayName, email, uid, photoURL })
                router.push('/')
            } else {
                router.push('/login')
            }
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <AuthContext.Provider value={{ user }}>
            <ProgressBar
                height="4px"
                color="#3b82f6"
                options={{ showSpinner: false }}
                shallowRouting
            />
            {children}
            <Toaster />
        </AuthContext.Provider>
    );
};

export default AuthContext;