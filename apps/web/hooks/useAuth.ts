import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import useAuthStore from "store/authStore";

const useAuth = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    const router = useRouter();
    const { setUser, setToken } = useAuthStore();

    const signInWithGoogle = async () => {
        setLoadingGoogle(true);
        try {
            const { data, error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/hub"
            });
            if (error) throw new Error(error.message);
            if (data) {
                if ("user" in data) {
                    setUser(data.user);
                    setToken(data.token);
                    router.push("/hub");
                } else if ("url" in data && data.url) {
                    window.location.href = data.url;
                }
            }
        } finally {
            setLoadingGoogle(false);
        }
    }

    const signInWithEmail = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
                rememberMe: true,
                callbackURL: "/hub",
            })
            if (error) throw new Error(error.message);
            if (data) {
                setUser(data.user)
                setToken(data.token);
                router.push("/hub");
            }
        } finally {
            setLoading(false);
        }
    }

    const signUpWithEmail = async (name: string, email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await authClient.signUp.email({
                name,
                email,
                password,
                callbackURL: "/hub",
            })
            if (error) throw new Error(error.message);
            if (data) {
                setUser(data.user)
                setToken(data.token);
                router.push("/hub");
            }
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        setIsLoggingOut(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/");
                    },
                },
            });
            setUser(null);
            setToken(null);
        } finally {
            setIsLoggingOut(false);
        }
    }

    return {
        loading,
        loadingGoogle,
        isLoggingOut,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
    }
}

export default useAuth;