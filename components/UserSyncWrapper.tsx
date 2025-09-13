'use client'

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import streamClient from "@/lib/stream";
import { createToken } from "@/actions/createToken";

const UserSyncWrapper = ({children}: {children: React.ReactNode}) => {

    const {user, isLoaded: isUserLoaded} = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const createOrUpdateUser = useMutation(api.users.upsertUser);

    const syncUser = useCallback(async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            setError(null);

            const tokenProvider = async () => {
                if (!user?.id) {
                    throw new Error("User is not authenticated");
                }
                const token = await createToken(user.id);
                return token;
            }
            
            // Save user to convex
            await createOrUpdateUser({
                userId: user.id,
                name: 
                    user.fullName ||
                    user.firstName ||
                    user.emailAddresses[0]?.emailAddress || 
                    "Unknown User",
                email: user.emailAddresses[0]?.emailAddress || "",
                imageUrl: user.imageUrl || "",
            });

            // Connect to Stream (server-side)
            await streamClient.connectUser(
                {
                    id: user.id,
                    name: 
                        user.fullName ||
                        user.firstName ||
                        user.emailAddresses[0]?.emailAddress ||
                        "Unknown User",
                    image: user.imageUrl || "",
                },
                tokenProvider
            );
        } catch (error) {
            console.error("Error syncing user:", error);
            setError(error instanceof Error ? error.message : "Failed to sync user");
        } finally {
            setIsLoading(false);
        }
    }, [createOrUpdateUser, user]);

    // Disconnect User
    const disconnectUser = useCallback(async () => {
        try {
            await streamClient.disconnectUser();
        } catch (error) {
            console.error("Error disconnecting user:", error);
        }
    }, []);

    useEffect(() => {
        if (isUserLoaded) {
            if (user) {
                syncUser();
            } else {
                disconnectUser();
                setIsLoading(false);
            }
        } else return;

        // cleanup
        return () => {
            if (user) disconnectUser();
        }
    }, [isUserLoaded, user, syncUser, disconnectUser]);

    // Loading state
    if (!isUserLoaded || isLoading) {
        return (
            <LoadingSpinner
                size="lg" 
                message={!isUserLoaded ? "Loading...": "Syncing user data..."} 
                className="min-h-screen"
            />
        )
    }

    if (error) {
        return (
            <div className="flex-1 items-center justify-center bg-white px-6">
                <p className="text-red-500 text-lg font-semibold mb-2">Sync Error</p>
                <p className="text-gray-600 text-center mb-4">{error}</p>
                <p className="text-gray-500 text-sm text-center">
                    Please try refreshing the page or contact support if the issue persists.
                </p>
            </div>
        )
    }

    return <>{children}</>
    
}

export default UserSyncWrapper