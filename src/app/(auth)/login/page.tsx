"use client";

import { loginUser } from "@/actions/auth.actions";
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
            toast.success("Connexion réussie !");
            router.push("/home");
            router.refresh();
        }
    }

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
                href="/register"
                className="absolute right-4 top-4 md:right-8 md:top-8 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2"
            >
                S'inscrire
            </Link>
            <div className="relative hidden h-full flex-col bg-slate-900 p-10 text-white lg:flex justify-between">
                <div className="absolute inset-0 bg-slate-900 bg-[url('https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="relative z-20 flex items-center text-xl font-bold gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    Pulse
                </div>
                <div className="relative z-20">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;L'excellence n'est pas un acte, mais une habitude. Prenez le contrôle de votre parcours d'apprentissage dès aujourd'hui.&rdquo;
                        </p>
                        <footer className="text-sm font-medium">Pulse Platform</footer>
                    </blockquote>
                </div>
            </div>
            <div className="p-8 lg:p-8 h-full flex items-center">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Bon retour !
                        </h1>
                        <p className="text-sm text-slate-500">
                            Entrez votre email pour vous connecter à votre espace.
                        </p>
                    </div>

                    <div className="space-y-3 mt-6">
                        <button type="button" onClick={() => handleOAuth('google')} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-medium">
                            <Chrome className="w-4 h-4" />
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

                    <p className="px-8 text-center text-sm text-slate-500">
                        En cliquant sur continuer, vous acceptez nos{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-slate-900">
                            Conditions d'utilisation
                        </Link>{" "}
                        et notre{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-slate-900">
                            Politique de confidentialité
                        </Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
