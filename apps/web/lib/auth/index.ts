import { useState } from "react";
import { authClient } from "../auth-client";
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const signInWithGoogle = async () => {
        setLoading(true);
        await authClient.signIn.social({
            provider: "google",
        });
        setLoading(false);
    }

    const logout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin");
                },
            },
        });
    }

    return {
        loading,
        signInWithGoogle,
        logout
    }
}