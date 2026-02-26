"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { updateDailyMetrics } from "@/actions/auth.actions";
import { Smile, Zap } from "lucide-react";

interface MoraleMetricsProps {
    userId: string;
    dateStr: string;
    initialMood: number;
    initialEnergy: number;
}

export default function MoraleMetrics({ userId, dateStr, initialMood, initialEnergy }: MoraleMetricsProps) {
    const [mood, setMood] = useState([initialMood]);
    const [energy, setEnergy] = useState([initialEnergy]);

    async function handleCommit(type: "mood" | "energy", val: number) {
        if (type === "mood") {
            await updateDailyMetrics(userId, dateStr, val, energy[0]);
        } else {
            await updateDailyMetrics(userId, dateStr, mood[0], val);
        }
    }

    return (
        <Card className="rounded-2xl shadow-sm border-slate-200">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-800">Indicateurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-600 flex items-center gap-2">
                            <Smile className="w-4 h-4 text-indigo-500" /> Humeur
                        </span>
                        <span className="text-indigo-600 font-bold">{mood[0]}/10</span>
                    </div>
                    <Slider
                        defaultValue={[initialMood]}
                        max={10}
                        min={1}
                        step={1}
                        value={mood}
                        onValueChange={setMood}
                        onValueCommit={(val) => handleCommit("mood", val[0])}
                        className="py-1"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-600 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" /> Énergie
                        </span>
                        <span className="text-amber-500 font-bold">{energy[0]}/10</span>
                    </div>
                    <Slider
                        defaultValue={[initialEnergy]}
                        max={10}
                        min={1}
                        step={1}
                        value={energy}
                        onValueChange={setEnergy}
                        onValueCommit={(val) => handleCommit("energy", val[0])}
                        className="py-1 [&_[role=slider]]:border-amber-500 [&_[role=slider]]:bg-white [&_.relative>.absolute]:bg-amber-400"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
