'use client'
import { createSession } from '@/service/auth/auth';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

const LoginButton = () => {
    const router = useRouter();
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string}>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    if (!credentialResponse.credential) {
                        toast.error("Login Failed");
                        return
                    }
                    createSession(credentialResponse.credential).then(res => {
                        if (!res) {
                            toast.error("Login Failed");
                            return
                        } else {
                            toast.success("Login Success");
                            router.back();
                        }
                    }).catch(() => {
                        toast.error("Login Failed");
                    })
                }}
                onError={() => {
                    toast.error("Login Failed");
                }}
                useOneTap
            />
        </GoogleOAuthProvider>
    )
}

export default LoginButton