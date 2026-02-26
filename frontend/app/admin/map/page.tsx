"use client";

import React from "react";
import { MapPin, Layers, Eye, Phone, Mail, User } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";

const wardContacts = [
    { ward: "W-1", officer: "Suresh Yadav", designation: "Ward Officer", phone: "+91 98100 12001", email: "w1.officer@suvidha.gov" },
    { ward: "W-3", officer: "Meena Gupta", designation: "Ward Officer", phone: "+91 98100 12003", email: "w3.officer@suvidha.gov" },
    { ward: "W-5", officer: "Rakesh Singh", designation: "Senior Inspector", phone: "+91 98100 12005", email: "w5.officer@suvidha.gov" },
    { ward: "W-8", officer: "Anita Sharma", designation: "Ward Officer", phone: "+91 98100 12008", email: "w8.officer@suvidha.gov" },
    { ward: "W-12", officer: "Deepak Verma", designation: "Ward Officer", phone: "+91 98100 12012", email: "w12.officer@suvidha.gov" },
    { ward: "W-15", officer: "Kavita Joshi", designation: "Senior Inspector", phone: "+91 98100 12015", email: "w15.officer@suvidha.gov" },
];

export default function AdminMapPage() {
    return (
        <div className="space-y-6">
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

            {/* Map Placeholder */}
            <Card padding="none">
                <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-surface-muted to-surface flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }} />
                    {[
                        { left: "20%", top: "25%", label: "W-1", complaints: 12, color: "bg-success-500/20" },
                        { left: "45%", top: "15%", label: "W-3", complaints: 8, color: "bg-success-500/20" },
                        { left: "65%", top: "30%", label: "W-5", complaints: 23, color: "bg-warning-500/20" },
                        { left: "30%", top: "55%", label: "W-8", complaints: 31, color: "bg-danger-500/20" },
                        { left: "55%", top: "60%", label: "W-12", complaints: 15, color: "bg-primary-500/20" },
                        { left: "75%", top: "50%", label: "W-15", complaints: 19, color: "bg-warning-500/20" },
                    ].map((ward) => (
                        <div key={ward.label} className={`absolute ${ward.color} rounded-2xl border border-border/50 p-3 cursor-pointer hover:bg-primary-500/20 transition-colors group`} style={{ left: ward.left, top: ward.top, width: "120px", height: "80px" }}>
                            <p className="text-xs font-bold text-fg">{ward.label}</p>
                            <p className="text-[10px] text-fg-muted">{ward.complaints} complaints</p>
                            <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="primary" size="sm">View</Badge>
                            </div>
                        </div>
                    ))}
                    <div className="relative z-10 text-center">
                        <MapPin className="h-12 w-12 text-primary-500 mx-auto mb-2 animate-bounce" />
                        <p className="text-sm font-medium text-fg">Interactive Leaflet Map</p>
                        <p className="text-xs text-fg-muted mt-1">Lazy-loaded in production</p>
                    </div>
                </div>
            </Card>

            {/* Ward Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { ward: "W-1", total: 12, resolved: 11, rate: "92%" },
                    { ward: "W-3", total: 8, resolved: 7, rate: "87%" },
                    { ward: "W-5", total: 23, resolved: 22, rate: "95%" },
                    { ward: "W-8", total: 31, resolved: 24, rate: "78%" },
                    { ward: "W-12", total: 15, resolved: 14, rate: "91%" },
                    { ward: "W-15", total: 19, resolved: 16, rate: "84%" },
                ].map((ward) => (
                    <Card key={ward.ward}>
                        <CardContent>
                            <p className="text-sm font-bold text-fg">{ward.ward}</p>
                            <p className="text-xl font-bold text-primary-600 mt-1">{ward.rate}</p>
                            <p className="text-xs text-fg-muted">{ward.resolved}/{ward.total} resolved</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Ward Contact Details */}
            <Card>
                <CardContent>
                    <h2 className="text-lg font-semibold text-fg mb-4">Ward Contact Details</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wardContacts.map((contact) => (
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
                </CardContent>
            </Card>
        </div>
    );
}
