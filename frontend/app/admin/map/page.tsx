"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Layers, Eye, Phone, Mail, User, AlertCircle } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { getWardData, getWardContacts, getWardMapMarkers, WardData, WardContact, WardMapMarker } from "@/services/ward.service";
import { useI18nStore } from "@/store/i18n.store";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-surface-muted flex items-center justify-center">Loading map...</div>,
});

import { cn } from "@/utils/cn";

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
            <div className="space-y-6">
                <div className="h-8 w-40 bg-surface-muted rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 rounded-2xl bg-surface border border-border animate-pulse" />
                    <div className="h-80 rounded-2xl bg-surface border border-border animate-pulse" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <AlertCircle className="h-10 w-10 text-danger-500 mx-auto mb-3" />
                <p className="text-fg-secondary">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <motion.div initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-fg">Ward Map</h1>
                    <p className="text-fg-secondary mt-1">GIS ward mapping with complaint heatmap</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Layers className="h-4 w-4" />}>Layers</Button>
                    <Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />}>Heatmap</Button>
                </div>
            </div>

            {/* ── 2-Column Card Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Card 1: Interactive Map */}
                <motion.div variants={cardAnim} custom={0}>
                    <Card padding="none" className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
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
                <motion.div variants={cardAnim} custom={1}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardContent>
                            <h2 className="text-lg font-semibold text-fg mb-4">Ward Summary</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {wards.map((ward) => {
                                    const isSelected = selectedWard === ward.ward;
                                    return (
                                        <div
                                            key={ward.ward}
                                            onClick={() => setSelectedWard(ward.ward)}
                                            className={cn(
                                                "text-center p-4 rounded-xl cursor-pointer transition-all duration-300",
                                                isSelected ? "bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500 shadow-md scale-105" : "bg-surface-muted hover:bg-surface-muted/70"
                                            )}
                                        >
                                            <p className="text-sm font-bold text-fg">{ward.ward}</p>
                                            <p className="text-xl font-bold text-primary-600 mt-1">{ward.rate}</p>
                                            <p className="text-xs text-fg-muted">{ward.resolved}/{ward.total} resolved</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 3: Contact Details (spans full width) */}
                <motion.div variants={cardAnim} custom={2} className="lg:col-span-2">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent>
                            <h2 className="text-lg font-semibold text-fg mb-4">Ward Contact Details</h2>
                            {contacts.length === 0 ? (
                                <p className="text-center text-fg-muted py-8">No contacts available</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {contacts.map((contact) => (
                                        <div key={contact.ward} className="p-4 rounded-xl bg-surface-muted hover:bg-surface-muted/70 transition-colors">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant="primary" size="sm">{contact.ward}</Badge>
                                                <span className="text-xs text-fg-muted">{contact.designation}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3.5 w-3.5 text-fg-muted" />
                                                    <span className="text-sm font-medium text-fg">{contact.officer}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3.5 w-3.5 text-fg-muted" />
                                                    <a href={`tel:${contact.phone}`} className="text-sm text-primary-600 hover:underline">{contact.phone}</a>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3.5 w-3.5 text-fg-muted" />
                                                    <a href={`mailto:${contact.email}`} className="text-sm text-primary-600 hover:underline truncate">{contact.email}</a>
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
