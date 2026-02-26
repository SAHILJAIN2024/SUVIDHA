"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Layers, Eye, Phone, Mail, User, AlertCircle } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { getWardData, getWardContacts, getWardMapMarkers, WardData, WardContact, WardMapMarker } from "@/services/ward.service";
import { useGSAP } from "@/hooks/useGSAP";
import { useI18nStore } from "@/store/i18n.store";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-surface-muted flex items-center justify-center">Loading map...</div>
});

import { cn } from "@/utils/cn";

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
    const gsapRef = useGSAP<HTMLDivElement>(".gsap-item", { y: 14, stagger: 0.04 });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-40 bg-surface-muted rounded-lg animate-pulse" />
                <div className="aspect-[16/9] rounded-2xl bg-surface border border-border animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-surface border border-border animate-pulse" />)}
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
        <div ref={gsapRef} className="space-y-6">
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

            {/* Map Section */}
            <Card padding="none" className="overflow-hidden">
                <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[25/9] rounded-2xl relative">
                    <InteractiveMap
                        center={[28.6139, 77.2090]} // Default center (Delhi)
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

            {/* Ward Summary - Highlight Selected */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {wards.map((ward) => {
                    const isSelected = selectedWard === ward.ward;
                    return (
                        <Card
                            key={ward.ward}
                            className={cn(
                                "transition-all duration-300",
                                isSelected ? "ring-2 ring-primary-500 shadow-lg scale-105 z-10" : "opacity-90 hover:opacity-100"
                            )}
                            onClick={() => setSelectedWard(ward.ward)}
                        >
                            <CardContent>
                                <p className="text-sm font-bold text-fg">{ward.ward}</p>
                                <p className="text-xl font-bold text-primary-600 mt-1">{ward.rate}</p>
                                <p className="text-xs text-fg-muted">{ward.resolved}/{ward.total} resolved</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Ward Contact Details */}
            <Card>
                <CardContent>
                    <h2 className="text-lg font-semibold text-fg mb-4">Ward Contact Details</h2>
                    {contacts.length === 0 ? (
                        <p className="text-center text-fg-muted py-8">No contacts available</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {contacts.map((contact) => (
                                <div key={contact.ward} className="p-4 rounded-xl bg-surface-muted hover:bg-surface-muted/80 transition-colors">
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
        </div>
    );
}
