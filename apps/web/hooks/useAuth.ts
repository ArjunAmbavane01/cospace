import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const useAuth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
    const router = useRouter();

    const signInWithGoogle = useCallback(async () => {
        setLoadingGoogle(true);
        const { data, error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/hub"
        });
        setLoadingGoogle(false);
        if (error) throw new Error(error.message);
    }, []);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        setLoading(true);
        const { error } = await authClient.signIn.email({
            email,
            password,
            rememberMe: true,
            callbackURL: "/hub",
        })
        setLoading(false);
        if (error) throw new Error(error.message);
        router.push("/hub");
    }, []);

    const signUpWithEmail = useCallback(async (name: string, email: string, password: string) => {
        setLoading(true);
        const { error } = await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: "/hub",
        })
        setLoading(false);
        if (error) throw new Error(error.message);
        router.push("/hub");
    }, []);

    const logout = useCallback(async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
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