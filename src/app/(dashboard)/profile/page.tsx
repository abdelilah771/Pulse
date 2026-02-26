"use client";

import { useState, useRef, useEffect } from "react";
import { User, Shield, Key, AlertCircle, CheckCircle, Upload, Loader2, RefreshCw } from "lucide-react";
import { updateProfile, updatePassword, getMfaStatus, enrollMfa, verifyMfaEnrollment, unenrollMfa } from "@/actions/auth.actions";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import AvatarUploader from "@/components/blocks/AvatarUploader";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"general" | "security">("general");
    const [user, setUser] = useState<any>(null);
    const [isPending, setIsPending] = useState(false);

    // Avatar State
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Security 2FA State
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [mfaFactors, setMfaFactors] = useState<any[]>([]);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [enrollFactorId, setEnrollFactorId] = useState<string | null>(null);
    const [enrollCode, setEnrollCode] = useState("");

    const supabase = createClient();

    useEffect(() => {
        async function loadUser() {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setAvatarUrl(data.user?.user_metadata?.avatar_url || data.user?.user_metadata?.picture || null);

            const mfaData = await getMfaStatus();
            setMfaEnabled(mfaData.enabled);
            setMfaFactors(mfaData.factors);
        }
        loadUser();
    }, []);

    // --- GENERAL FORM HANDLER ---
    const handleProfileSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            if (avatarUrl) formData.append("avatarUrl", avatarUrl);
            const result = await updateProfile(formData);
            if (result.error) throw new Error(result.error);
            toast.success("Profil mis à jour !");
            window.location.reload(); // Refresh to update TopNav avatar
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la mise à jour.");
        } finally {
            setIsPending(false);
        }
    };
    // --- PASSWORD HANDLER ---
    const handlePasswordSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            const result = await updatePassword(formData);
            if (result.error) throw new Error(result.error);
            toast.success("Mot de passe mis à jour !");
            (document.getElementById("passwordForm") as HTMLFormElement).reset();
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la mise à jour du mot de passe.");
        } finally {
            setIsPending(false);
        }
    };

    // --- 2FA MFA HANDLERS ---
    const startMfaEnroll = async () => {
        setIsPending(true);
        try {
            const result = await enrollMfa();
            if (result.error) throw new Error(result.error);
            setQrCode(result.qrCodeUri!);
            setEnrollFactorId(result.factorId!);
        } catch (error: any) {
            toast.error(error.message || "Impossible de démarrer l'activation 2FA.");
        } finally {
            setIsPending(false);
        }
    };

    const confirmMfaEnroll = async () => {
        if (!enrollCode || !enrollFactorId) return;
        setIsPending(true);
        try {
            const result = await verifyMfaEnrollment(enrollFactorId, enrollCode);
            if (result.error) throw new Error(result.error);
            toast.success("Authentification double 2FA activée avec succès !");

            setQrCode(null);
            setEnrollFactorId(null);
            setEnrollCode("");

            const mfaData = await getMfaStatus();
            setMfaEnabled(mfaData.enabled);
            setMfaFactors(mfaData.factors);
        } catch (error: any) {
            toast.error("Le code est invalide ou expiré.");
        } finally {
            setIsPending(false);
        }
    };

    const disableMfa = async (factorId: string) => {
        if (!confirm("Voulez-vous vraiment désactiver la double authentification ? Votre compte sera moins sécurisé.")) return;
        setIsPending(true);
        try {
            const result = await unenrollMfa(factorId);
            if (result.error) throw new Error(result.error);
            toast.success("Double authentification désactivée.");

            const mfaData = await getMfaStatus();
            setMfaEnabled(mfaData.enabled);
            setMfaFactors(mfaData.factors);
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la désactivation.");
        } finally {
            setIsPending(false);
        }
    };

    if (!user) {
        return <div className="p-8 flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="p-6 md:p-8 max-w-4xl mx-auto w-full pb-32">
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-8">
                    Paramètres du Profil
                </h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-64 shrink-0">
                        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
                            <button
                                onClick={() => setActiveTab("general")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "general"
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                <User className="w-5 h-5" /> Informations
                            </button>
                            <button
                                onClick={() => setActiveTab("security")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "security"
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                <Shield className="w-5 h-5" /> Sécurité
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full max-w-2xl">

                        {/* --- GENERAL TAB --- */}
                        {activeTab === "general" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

                                <div className="glass-card rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/5">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Informations Personnelles</h2>

                                    <form action={handleProfileSubmit} className="space-y-6">
                                        <div className="pb-6 border-b border-black/5 dark:border-white/5">
                                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">Photo de profil</label>
                                            <AvatarUploader
                                                currentAvatar={avatarUrl}
                                                onUploadSuccess={(url) => setAvatarUrl(url)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Adresse Email</label>
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-slate-500 dark:text-slate-400">L'email ne peut pas être modifié pour le moment.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Nom Complet</label>
                                            <input
                                                name="name"
                                                required
                                                type="text"
                                                defaultValue={user.user_metadata?.name || ""}
                                                className="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Enregistrer les modifications
                                        </button>
                                    </form>
                                </div>

                            </div>
                        )}

                        {/* --- SECURITY TAB --- */}
                        {activeTab === "security" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

                                {/* Password Section */}
                                <div className="glass-card rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/5">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                                        <Key className="w-5 h-5 text-primary" /> Mot de passe
                                    </h2>

                                    <form id="passwordForm" action={handlePasswordSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Nouveau mot de passe</label>
                                            <input
                                                name="password"
                                                required
                                                type="password"
                                                minLength={6}
                                                className="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                                        >
                                            {isPending ? "Mise à jour..." : "Mettre à jour"}
                                        </button>
                                    </form>
                                </div>

                                {/* 2FA MFA Section */}
                                <div className="glass-card rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <Shield className="w-5 h-5 text-primary" /> Authentification Double Facteur (2FA)
                                            </h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                                        </div>
                                        {mfaEnabled ? (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                                                <CheckCircle className="w-3.5 h-3.5" /> Activé
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
                                                <AlertCircle className="w-3.5 h-3.5" /> Désactivé
                                            </span>
                                        )}
                                    </div>

                                    {mfaEnabled ? (
                                        <div className="border border-black/5 dark:border-white/5 rounded-xl p-4 bg-black/5 dark:bg-black/20">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                                Votre compte est protégé par la double authentification. Lors de votre prochaine connexion, il vous sera demandé d'entrer un code généré par votre application d'authentification.
                                            </p>
                                            {mfaFactors.map(factor => (
                                                <div key={factor.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 py-3 border-t border-black/5 dark:border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                                            <Shield className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">App Authenticator</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">Ajouté le {new Date(factor.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => disableMfa(factor.id)}
                                                        disabled={isPending}
                                                        className="px-4 py-2 text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors"
                                                    >
                                                        Retirer
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {!qrCode ? (
                                                <button
                                                    onClick={startMfaEnroll}
                                                    disabled={isPending}
                                                    className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all"
                                                >
                                                    {isPending ? "Chargement..." : "Activer via Authenticator"}
                                                </button>
                                            ) : (
                                                <div className="border border-black/5 dark:border-white/5 rounded-xl p-6 bg-black/5 dark:bg-black/20 space-y-6 animate-in fade-in slide-in-from-top-4">
                                                    <div className="space-y-2">
                                                        <h3 className="text-md font-bold text-slate-900 dark:text-white">1. Scannez le QR Code</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                                            Ouvrez votre application d'authentification (Google Authenticator, Authy, etc.) et scannez l'image ci-dessous.
                                                        </p>
                                                    </div>

                                                    <div className="p-4 bg-white rounded-xl inline-block">
                                                        <QRCodeSVG value={qrCode} size={150} />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h3 className="text-md font-bold text-slate-900 dark:text-white">2. Confirmez le code</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                                            Entrez le code à 6 chiffres généré par votre application.
                                                        </p>
                                                        <div className="flex gap-2 w-full max-w-sm pt-2">
                                                            <input
                                                                type="text"
                                                                maxLength={6}
                                                                placeholder="000000"
                                                                value={enrollCode}
                                                                onChange={(e) => setEnrollCode(e.target.value.replace(/[^0-9]/g, ''))}
                                                                className="flex-1 bg-white dark:bg-[#101922] border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-center font-mono text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                            />
                                                            <button
                                                                onClick={confirmMfaEnroll}
                                                                disabled={enrollCode.length < 6 || isPending}
                                                                className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-xl text-sm font-bold transition-all"
                                                            >
                                                                Vérifier
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
