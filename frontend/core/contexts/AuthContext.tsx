"use client";

import { useRouter } from "next/navigation";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { User, getMe } from "@/core/lib/users";
import {
    login as apiLogin,
    logout as apiLogout,
    LoginPayload,
    AuthTokens,
    isAuthenticated as checkIsAuthenticated,
    clearTokens,
} from "@/core/lib/auth";
import api from "@/core/lib/axios";
import { ApiHistoryItem } from "@/core/types/movie";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (payload: LoginPayload) => Promise<{ success: boolean } & AuthTokens>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    isVerified: boolean;
    watchedMovieIds: Set<string>;
    refreshWatchHistory: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [watchedMovieIds, setWatchedMovieIds] = useState<Set<string>>(new Set());

    const refreshWatchHistory = useCallback(async () => {
        try {
            let res;
            try {
                res = await api.get("/movies/history");
            } catch (err) {
                const isNotFoundError =
                    err &&
                    typeof err === "object" &&
                    "response" in err &&
                    err.response &&
                    typeof err.response === "object" &&
                    "status" in err.response &&
                    err.response.status === 404;

                if (isNotFoundError) {
                    res = await api.get("/movie/history");
                } else {
                    throw err;
                }
            }
            if (res.data?.success && res.data.data) {
                const dataObj = res.data.data;
                const list = Array.isArray(dataObj)
                    ? dataObj
                    : Array.isArray(dataObj.movies)
                    ? dataObj.movies
                    : [];
                const ids = new Set<string>();
                list.forEach((item: ApiHistoryItem) => {
                    const m = item.movie || item;
                    const id = m.imdb_code || m.id;
                    if (id) ids.add(id);
                });
                setWatchedMovieIds(ids);
            }
        } catch (error) {
            const responseData =
                error &&
                typeof error === "object" &&
                "response" in error &&
                error.response &&
                typeof error.response === "object" &&
                "data" in error.response
                    ? (error.response.data as { message?: string; error?: string })
                    : undefined;
            console.error(
                "Failed to fetch watch history in AuthContext:",
                responseData?.message || responseData?.error || error,
            );
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const profile = await getMe();
            setUser(profile);
        } catch (error) {
            const responseData =
                error &&
                typeof error === "object" &&
                "response" in error &&
                error.response &&
                typeof error.response === "object" &&
                "data" in error.response
                    ? (error.response.data as { message?: string; error?: string })
                    : undefined;
            console.error(
                "Failed to fetch user profile:",
                responseData?.message || responseData?.error || error,
            );
            setUser(null);
            clearTokens();
            const pathname =
                typeof window !== "undefined" ? window.location.pathname : "";
            if (pathname.startsWith("/home")) {
                router.push("/login");
            }
        }
    }, [router]);

    // Initialize and load user profile if authenticated
    useEffect(() => {
        const initAuth = async () => {
            if (checkIsAuthenticated()) {
                await refreshUser();
                await refreshWatchHistory();
            }
            setLoading(false);
        };

        initAuth();
    }, [refreshUser, refreshWatchHistory]);

    const login = async (payload: LoginPayload) => {
        setLoading(true);
        try {
            const response = await apiLogin(payload);
            await refreshUser();
            await refreshWatchHistory();
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await apiLogout();
        } finally {
            setUser(null);
            setWatchedMovieIds(new Set());
            setLoading(false);
            window.location.href = "/login";
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isVerified: !!user,
        watchedMovieIds,
        refreshWatchHistory,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
