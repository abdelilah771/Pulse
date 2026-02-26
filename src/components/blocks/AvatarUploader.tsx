"use client";

import { useState, useRef } from "react";
import * as nsfwjs from "nsfwjs";
import toast from "react-hot-toast";
import { Loader2, UploadCloud, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AvatarUploader({ currentAvatar, onUploadSuccess }: { currentAvatar?: string | null, onUploadSuccess: (url: string) => void }) {
    const [isChecking, setIsChecking] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentAvatar || null);

    // We only load the model once to save bandwidth/time
    const modelRef = useRef<nsfwjs.NSFWJS | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createClient();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Veuillez sélectionner une image valide.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("L'image est trop volumineuse (max 5MB).");
            return;
        }

        // 1. Generate preview for analysis
        const reader = new FileReader();
        reader.onload = async (e) => {
            const result = e.target?.result as string;
            setPreview(result);

            // Wait for image to render in the DOM before analyzing
            setTimeout(() => analyzeImage(file), 100);
        };
        reader.readAsDataURL(file);
    };

    const analyzeImage = async (file: File) => {
        if (!imageRef.current) return;
        setIsChecking(true);

        try {
            // Load the model from unpkg if not loaded yet
            if (!modelRef.current) {
                toast.loading("Chargement de l'IA d'analyse...", { id: "nsfw-load" });
                modelRef.current = await nsfwjs.load();
                toast.dismiss("nsfw-load");
            }

            const predictions = await modelRef.current.classify(imageRef.current);

            // Check probabilities
            const pornProb = predictions.find(p => p.className === "Porn")?.probability || 0;
            const hentaiProb = predictions.find(p => p.className === "Hentai")?.probability || 0;
            const sexyProb = predictions.find(p => p.className === "Sexy")?.probability || 0;

            console.log("NSFW Analysis:", predictions);

            // Stricter guards against nudity
            if (pornProb > 0.4 || hentaiProb > 0.4 || sexyProb > 0.8) {
                toast.error("Image rejetée. Contenu inapproprié détecté.", { duration: 5000 });
                setPreview(currentAvatar || null); // Revert
                if (fileInputRef.current) fileInputRef.current.value = "";
                return; // Stop upload
            }

            // Image is safe, proceed to upload
            await uploadToSupabase(file);

        } catch (error) {
            console.error("Error analyzing image:", error);
            toast.error("Impossible d'analyser l'image. Veuillez réessayer.");
            setPreview(currentAvatar || null);
        } finally {
            setIsChecking(false);
        }
    };

    const uploadToSupabase = async (file: File) => {
        setIsUploading(true);
        toast.loading("Sauvegarde de l'image...", { id: "uploading" });
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // We need the user session to use Supabase Storage correctly
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Non authentifié");

            // Define the personalized path
            const userFilePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(userFilePath, file, { upsert: true });

            if (uploadError) throw new Error(uploadError.message);

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(userFilePath);

            toast.dismiss("uploading");
            toast.success("Photo de profil mise à jour !");
            onUploadSuccess(publicUrl);

        } catch (error: any) {
            console.error("Upload error:", error);
            toast.dismiss("uploading");
            toast.error("Erreur lors de l'upload: " + (error.message || "Unknown error"));
            setPreview(currentAvatar || null);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center sm:items-start gap-4">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
            />

            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-[#101922] border-4 border-white dark:border-[#1a2332] shadow-xl overflow-hidden flex items-center justify-center text-3xl font-bold text-slate-400">
                        {preview ? (
                            <img
                                ref={imageRef}
                                src={preview}
                                alt="Avatar Preview"
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                                className={`w-full h-full object-cover transition-opacity duration-300 ${isChecking ? "opacity-30 blur-sm" : "opacity-100"}`}
                            />
                        ) : (
                            <span className="text-sm">Logo</span>
                        )}

                        {(isChecking || isUploading) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-all">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isChecking || isUploading}
                        className="px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-lg text-sm font-medium transition-colors border border-black/5 dark:border-white/5 flex items-center gap-2 disabled:opacity-50"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Changer de photo
                    </button>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] text-center sm:text-left flex items-start gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                        Toutes les photos sont analysées par notre IA pour bloquer les contenus inappropriés.
                    </p>
                </div>
            </div>
            {isChecking && <p className="text-xs font-semibold text-primary animate-pulse">L'intelligence artificielle analyse votre image...</p>}
        </div>
    );
}
