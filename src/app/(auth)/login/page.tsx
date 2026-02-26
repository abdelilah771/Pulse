"use client";

import { loginUser, logoutUser } from "@/actions/auth.actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Github, Chrome, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // MFA States
    const [needsMfa, setNeedsMfa] = useState(false);
    const [mfaCode, setMfaCode] = useState("");
    const [factorId, setFactorId] = useState<string | null>(null);

    const handleOAuth = async (provider: 'google' | 'github' | 'apple') => {
        const supabase = createClient();

        // Ensure we don't redirect to 0.0.0.0, which browsers reject
        const origin = typeof window !== 'undefined' && window.location.hostname === '0.0.0.0'
            ? 'http://localhost:3000'
            : window.location.origin;

        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${origin}/auth/callback`,
            },
        });
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const result = await loginUser(formData);

        if (result?.error) {
            toast.error(result.error);
            setLoading(false);
        } else {
            // Check for MFA requirements
            const supabase = createClient();
            const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

            if (error) {
                toast.error(error.message);
                setLoading(false);
                return;
            }

            if (data?.currentLevel === 'aal1' && data?.nextLevel === 'aal2') {
                // User needs to provide MFA code
                const { data: factorsData } = await supabase.auth.mfa.listFactors();
                if (factorsData && factorsData.totp && factorsData.totp.length > 0) {
                    setFactorId(factorsData.totp[0].id);
                    setNeedsMfa(true);
                    setLoading(false);
                    return;
                }
            }

            toast.success("Connexion réussie !");
            router.push("/home");
            router.refresh();
        }
    }

    const handleMfaVerify = async () => {
        if (!factorId || mfaCode.length < 6) return;
        setLoading(true);
        const supabase = createClient();

        const challengeAndVerify = await supabase.auth.mfa.challengeAndVerify({
            factorId,
            code: mfaCode
        });

        if (challengeAndVerify.error) {
            toast.error("Code 2FA incorrect ou expiré.");
            setLoading(false);
        } else {
            toast.success("Connexion réussie !");
            router.push("/home");
            router.refresh();
        }
    };

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
                href="/register"
                className="absolute right-4 top-4 md:right-8 md:top-8 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2"
            >
                S'inscrire
            </Link>
            <div className="relative hidden h-full flex-col bg-slate-900 p-10 text-white lg:flex justify-between">
                <div>
                    <div className="flex items-center gap-3 font-medium mb-12">
                        <div className="bg-primary/20 p-2 rounded-lg text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Personal Space</span>
                    </div>
                </div>
            </div>

            <div className="lg:p-8 flex" style={{ height: "calc(100vh - 4rem)" }}>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {!needsMfa ? (
                        <>
                            <div className="flex flex-col space-y-2 text-center">
                                <h1 className="text-2xl font-semibold tracking-tight">Bienvenue,</h1>
                                <p className="text-sm text-slate-500">
                                    Entrez vos identifiants ci-dessous pour vous connecter
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 mt-4">
                                <button type="button" onClick={() => handleOAuth('google')} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                                    <Chrome className="w-4 h-4 text-blue-500" />
                                    Continuer avec Google
                                </button>
                                <button type="button" onClick={() => handleOAuth('github')} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-medium">
                                    <Github className="w-4 h-4" />
                                    Continuer avec GitHub
                                </button>
                            </div>

                            <div className="relative flex items-center py-4">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 px-4 text-xs text-slate-400">or continue with email</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="email" className="text-xs font-medium text-slate-500 ml-1">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="nom@exemple.com"
                                        className="rounded-xl border-slate-200 px-4 py-5"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password" className="text-xs font-medium text-slate-500 ml-1">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="rounded-xl border-slate-200 px-4 py-5"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-full h-11 text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>Se connecter <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col space-y-6 text-center animate-in fade-in slide-in-from-bottom-4">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full text-primary mb-2">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Double Authentification</h1>
                                <p className="text-sm text-slate-500">
                                    Veuillez entrer le code à 6 chiffres généré par votre application d'authentification.
                                </p>
                            </div>
                            <div className="space-y-4 pt-4">
                                <Input
                                    type="text"
                                    maxLength={6}
                                    value={mfaCode}
                                    onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                                    required
                                    placeholder="000 000"
                                    className="rounded-xl border-slate-200 px-4 py-6 text-center text-2xl tracking-widest font-mono"
                                />
                                <Button
                                    type="button"
                                    onClick={handleMfaVerify}
                                    disabled={loading || mfaCode.length < 6}
                                    className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-full h-11 text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Vérifier le code"
                                    )}
                                </Button>
                                <button
                                    onClick={() => { setNeedsMfa(false); setMfaCode(""); logoutUser(); }}
                                    className="text-xs text-slate-400 hover:text-slate-600 underline mt-4"
                                >
                                    Annuler et se déconnecter
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
