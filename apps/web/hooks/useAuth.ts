import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import useAuthStore from "store/authStore";

const useAuth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
    const router = useRouter();
    const { setUser } = useAuthStore();

    const signInWithGoogle = useCallback(async () => {
        setLoadingGoogle(true);
        const { data, error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/hub"
        });
        if (error) throw new Error(error.message);
        if (data) {
            if ("user" in data) {
                setUser(data.user);
                setLoadingGoogle(false);
                router.push("/hub");
            } else if ("url" in data && data.url) {
                window.location.href = data.url;
            } else {
                setLoading(false);
            }
        }
    }, []);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        setLoading(true);
        const { data, error } = await authClient.signIn.email({
            email,
            password,
            rememberMe: true,
            callbackURL: "/hub",
        })
        if (error) {
            setLoading(false);
            throw new Error(error.message);
        }
        if (data) {
            setUser(data.user)
            setLoading(false);
            router.push("/hub");
        }
    }, []);

    const signUpWithEmail = useCallback(async (name: string, email: string, password: string) => {
        setLoading(true);
        const { data, error } = await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: "/hub",
        })
        if (error) {
            setLoading(false);
            throw new Error(error.message);
        }
        if (data) {
            setUser(data.user)
            setLoading(false);
            router.push("/hub");
        }
    }, []);

    const logout = useCallback(async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
        setUser(null);
    }, []);

    return {
        loading,
        loadingGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
    }
}

export default useAuth;