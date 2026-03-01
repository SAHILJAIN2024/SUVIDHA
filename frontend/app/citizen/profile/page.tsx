"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Edit3,
  Camera,
  Hash,
  Flame,
  PhoneCall,
} from "lucide-react";
import { Card, CardContent, Button, Badge, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";

interface Address {
  id: number;
  state: string;
  city: string;
  area: string;
  pin_code: string;
  ward: string;
}

interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  adhaar_no: string;
  gas_no: string;
  ivrs_no: string;
  role: string;
  created_at: string;
  addresses: Address[];
}

export default function ProfilePage() {
  const { token } = useAuthStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://suvidha-qxz1.onrender.com/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!data.success) return;

        setProfile(data.user);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleUpdate = async () => {
    if (!profile) return;

    try {
      const res = await fetch("https://suvidha-qxz1.onrender.com/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          dob: profile.dob,
          gender: profile.gender,
          gas_no: profile.gas_no,
          ivrs_no: profile.ivrs_no,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditing(false);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Profile not found.</div>;

  const primaryAddress = profile.addresses?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Profile Card */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile.name.charAt(0)}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <div className="flex gap-2 mt-2 justify-center sm:justify-start">
                <Badge size="sm" className="capitalize">
                  {profile.role}
                </Badge>
                {profile.adhaar_no && (
                  <Badge variant="success" size="sm">
                    <Shield className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
            </div>

            {editing ? (
              <Button size="sm" onClick={handleUpdate}>
                Save
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit3 className="h-4 w-4" />}
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.name}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              leftIcon={<User className="h-4 w-4" />}
            />

            <Input
              label="Email"
              value={profile.email}
              readOnly
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Phone"
              value={profile.phone || ""}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              leftIcon={<Phone className="h-4 w-4" />}
            />

            <Input
              label="Date of Birth"
              type="date"
              value={profile.dob?.split("T")[0] || ""}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({ ...profile, dob: e.target.value })
              }
              leftIcon={<Calendar className="h-4 w-4" />}
            />

            <Input
              label="Gender"
              value={profile.gender || ""}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
            />

            <Input
              label="Member Since"
              value={new Date(profile.created_at).toLocaleDateString()}
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Address</h3>

          {primaryAddress ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="State" value={primaryAddress.state} readOnly />
              <Input label="City" value={primaryAddress.city} readOnly />
              <Input label="Area" value={primaryAddress.area} readOnly />
              <Input label="PIN Code" value={primaryAddress.pin_code} readOnly />
              <Input label="Ward" value={primaryAddress.ward} readOnly />
            </div>
          ) : (
            <p>No address found.</p>
          )}
        </CardContent>
      </Card>

      {/* Linked Accounts */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">
            Linked Accounts
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Aadhaar Number"
              value={profile.adhaar_no || "Not linked"}
              readOnly
              leftIcon={<Shield className="h-4 w-4" />}
            />

            <Input
              label="Gas Connection"
              value={profile.gas_no || ""}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({ ...profile, gas_no: e.target.value })
              }
              leftIcon={<Flame className="h-4 w-4" />}
            />

            <Input
              label="IVRS Number"
              value={profile.ivrs_no || ""}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({ ...profile, ivrs_no: e.target.value })
              }
              leftIcon={<PhoneCall className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}