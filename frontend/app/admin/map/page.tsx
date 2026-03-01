"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Layers, Eye, Phone, Mail, User, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { getWardData, getWardContacts, getWardMapMarkers, WardData, WardContact, WardMapMarker } from "@/services/ward.service";
import { useI18nStore } from "@/store/i18n.store";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-surface-muted flex items-center justify-center animate-pulse rounded-2xl">Loading map...</div>,
});

import { cn } from "@/utils/cn";

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardAnim = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

export default function AdminMapPage() {
    const [wards, setWards] = useState<WardData[]>([]);
    const [contacts, setContacts] = useState<WardContact[]>([]);
    const [markers, setMarkers] = useState<WardMapMarker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWard, setSelectedWard] = useState<string | null>(null);
    const { t } = useI18nStore();

    useEffect(() => {
        Promise.all([getWardData(), getWardContacts(), getWardMapMarkers()])
            .then(([w, c, m]) => { setWards(w); setContacts(c); setMarkers(m); setLoading(false); })
            .catch(() => { setError("Failed to load ward data"); setLoading(false); });
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                <div className="h-8 w-40 bg-surface-muted rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
                    <div className="h-80 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-danger-50 dark:bg-danger-900/20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-danger-500" />
                </div>
                <p className="text-fg-secondary font-medium">{error}</p>
                <Button variant="outline" size="sm" className="mt-4 hover:bg-primary-50 hover:border-primary-200 transition-all" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8 p-4 md:p-6 lg:p-8 relative">
            {/* ── Decorative Background Blobs ── */}
            <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-primary-300/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

            {/* ── Header ── */}
            <motion.div variants={cardAnim} custom={0} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-fg">
                        Ward <span className="text-primary-600">Map</span>
                    </h1>
                    <p className="text-fg-secondary mt-1 text-sm">GIS ward mapping with complaint heatmap</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Layers className="h-4 w-4" />} className="hover:bg-primary-50 hover:border-primary-200 transition-all">Layers</Button>
                    <Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />} className="hover:bg-primary-50 hover:border-primary-200 transition-all">Heatmap</Button>
                </div>
            </motion.div>

            {/* ── 2-Column Card Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Card 1: Interactive Map */}
                <motion.div variants={cardAnim} custom={1} whileHover={{ y: -4, scale: 1.01 }}>
                    <Card padding="none" className="overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 h-full">
                        {/* Gradient icon header strip */}
                        <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-surface/50">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-md shadow-primary-500/30">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold text-fg uppercase tracking-wider">Live Map View</span>
                        </div>
                        <div className="aspect-[16/9] lg:aspect-auto lg:h-[400px] relative">
                            <InteractiveMap
                                center={[28.6139, 77.2090]}
                                markers={markers.map(m => ({
                                    lat: m.lat,
                                    lng: m.lng,
                                    label: m.label,
                                    complaints: m.complaints,
                                    status: m.status
                                }))}
                                onMarkerClick={(label) => setSelectedWard(label)}
                            />
                        </div>
                    </Card>
                </motion.div>

                {/* Card 2: Ward Summary Grid */}
                <motion.div variants={cardAnim} custom={2} whileHover={{ y: -4, scale: 1.01 }}>
                    <Card className="rounded-2xl sm:rounded-3xl border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 h-full">
                        <CardContent className="p-5 sm:p-6">
                            <h2 className="text-lg font-bold text-fg mb-5">
                                Ward <span className="text-primary-600">Summary</span>
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {wards.map((ward) => {
                                    const isSelected = selectedWard === ward.ward;
                                    const rateNum = parseInt(String(ward.rate));
                                    const rateColor = rateNum >= 90
                                        ? "text-emerald-600"
                                        : rateNum >= 80
                                            ? "text-amber-600"
                                            : "text-red-600";
                                    return (
                                        <motion.div
                                            key={ward.ward}
                                            whileHover={{ y: -2, scale: 1.03 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <div
                                                onClick={() => setSelectedWard(ward.ward)}
                                                className={cn(
                                                    "text-center p-4 rounded-2xl cursor-pointer transition-all duration-300 border",
                                                    isSelected
                                                        ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 shadow-lg shadow-primary-500/10 scale-105"
                                                        : "bg-surface-muted/50 border-border/40 hover:border-primary-200 hover:shadow-md"
                                                )}
                                            >
                                                <p className="text-sm font-bold text-fg">{ward.ward}</p>
                                                <p className={`text-xl font-extrabold mt-1 ${rateColor}`}>{ward.rate}</p>
                                                <p className="text-xs text-fg-muted font-medium mt-0.5">{ward.resolved}/{ward.total} resolved</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 3: Contact Details (spans full width) */}
                <motion.div variants={cardAnim} custom={3} className="lg:col-span-2">
                    <Card className="rounded-2xl sm:rounded-3xl border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
                        <CardContent className="p-5 sm:p-6">
                            <h2 className="text-lg font-bold text-fg mb-5">
                                Ward <span className="text-primary-600">Contact Details</span>
                            </h2>
                            {contacts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                                        <User className="h-7 w-7" />
                                    </div>
                                    <p className="text-base font-semibold text-fg mb-1">No contacts available</p>
                                    <p className="text-sm text-fg-secondary">Contact information will appear here once wards are configured.</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {contacts.map((contact) => (
                                        <div key={contact.ward} className="group p-5 rounded-2xl bg-surface-muted/50 border border-border/40 hover:border-primary-200 hover:shadow-lg transition-all duration-300 relative">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-500/30">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                                <Badge variant="primary" size="sm">{contact.ward}</Badge>
                                                <span className="text-xs text-fg-muted font-medium">{contact.designation}</span>
                                                <ChevronRight className="h-4 w-4 text-fg-muted group-hover:text-primary-600 transition-colors ml-auto opacity-0 group-hover:opacity-100" />
                                            </div>
                                            <div className="space-y-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <User className="h-3.5 w-3.5 text-fg-muted" />
                                                    <span className="text-sm font-semibold text-fg">{contact.officer}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <Phone className="h-3.5 w-3.5 text-fg-muted" />
                                                    <a href={`tel:${contact.phone}`} className="text-sm text-primary-600 hover:underline font-medium">{contact.phone}</a>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <Mail className="h-3.5 w-3.5 text-fg-muted" />
                                                    <a href={`mailto:${contact.email}`} className="text-sm text-primary-600 hover:underline truncate font-medium">{contact.email}</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
