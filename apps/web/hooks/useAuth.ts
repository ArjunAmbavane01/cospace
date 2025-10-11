import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const useAuth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const signInWithGoogle = useCallback(async () => {
        setLoading(true);
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/hub"
        });
        setLoading(false);
    }, []);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        setLoading(true);
        await authClient.signIn.email({
            email,
            password
        })
        setLoading(false);
    }, []);

    const signUpWithEmail = useCallback(async (name: string, email: string, password: string) => {
        setLoading(true);
        await authClient.signUp.email({
            name,
            email,
            password
        })
        setLoading(false);
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
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
    }
}

export default useAuth;