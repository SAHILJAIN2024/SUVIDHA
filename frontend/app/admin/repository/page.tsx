"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "../../../components/WalletContext";
import FACTORY_ABI from "../../../contractABI/contractABI.json";

/* ---------------- TYPES ---------------- */

interface BackendResponse {
  success: boolean;
  metadataUri: string;
}

/* ---------------- COMPONENT ---------------- */

export default function CreateSupplyChain() {
  const { address } = useWallet();

  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const [name, setName] = useState("");
  const [ward, setWard] = useState("");
  const [creators, setCreators] = useState("");
  const [committers, setCommitters] = useState("");
  const [Coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

  const [processSteps, setProcessSteps] = useState<string[]>(["Manufacturer"]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const FACTORY_ADDRESS = "0xf2F76eFB368c56817ED0bdeEFC7689DC859Eb467";

  /* ---------------- CONTRACT SETUP ---------------- */

  useEffect(() => {
    if (!address) return;

    const setup = async () => {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const instance = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI.abi,
        signer
      );

      setContract(instance);
    };

    setup();
  }, [address]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      setCoordinates({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  }, []);

  /* ---------------- PROCESS STEPS HANDLERS ---------------- */

  const handleProcessChange = (index: number, value: string) => {
    const updated = [...processSteps];
    updated[index] = value;
    setProcessSteps(updated);
  };

  const addStep = () => setProcessSteps([...processSteps, ""]);
  const removeStep = (index: number) =>
    setProcessSteps(processSteps.filter((_, i) => i !== index));

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contract || !address) return;

    try {
      setLoading(true);
      setStatus("UPLOADING METADATA TO BACKEND...");

      const formData = new FormData();
      formData.append("ownerAddress", address);
      formData.append("name", name);
      formData.append("ward", ward);
      formData.append("coordinates", JSON.stringify(Coordinates));
      formData.append("processSteps", JSON.stringify(processSteps));

      const res = await fetch(
        "https://chain-track.onrender.com/api/supply-chains",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Backend upload failed");

      const data: BackendResponse = await res.json();

      const creatorArray = creators
        ? creators.split(",").map((a) => a.trim())
        : [address];

      const committerArray = committers
        ? committers.split(",").map((a) => a.trim())
        : [address];

      setStatus("DEPLOYING SUPPLY CHAIN CONTRACT...");

      const tx = await contract.createSupplyChain(
        name,
        address,
        creatorArray,
        committerArray
      );

      const receipt = await tx.wait();

      let deployedAddress = "";
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed?.name === "SupplyChainCreated") {
            deployedAddress = parsed.args.contractAddress;
          }
        } catch {}
      }

      setStatus(`✅ DEPLOYED: ${deployedAddress}`);

      // Reset all fields
      setName("");
      setWard("");
      setCoordinates({ latitude: 0, longitude: 0 });
      setCreators("");
      setCommitters("");
      setProcessSteps(["Manufacturer"]);
    } catch (err: any) {
      console.error(err);
      setStatus("❌ ERROR: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 6000);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="relative min-h-screen bg-[#0a0e1a] text-white selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden flex flex-col items-center justify-center">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-transparent blur-[140px] rounded-full -z-10" />
      <div className="pointer-events-none absolute top-1/4 -right-20 w-[450px] h-[450px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
      <div className="pointer-events-none absolute bottom-10 -left-20 w-[450px] h-[450px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

      <main className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center justify-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16 w-full flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-mono tracking-wider uppercase mb-6 shadow-sm shadow-blue-500/10">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Smart Contract Factory
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
            CREATE{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent italic">
              SUPPLY CHAIN
            </span>
          </h1>
          <p className="text-slate-400 font-mono text-xs sm:text-sm uppercase tracking-widest max-w-xl text-center">
            Deploy Custom ERC-1155 Contract Instance
          </p>
        </motion.div>

        {/* Card Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full relative bg-[#0f1428]/80 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 shadow-2xl shadow-blue-950/40 p-6 sm:p-8 lg:p-10 rounded-3xl transition-colors duration-300"
        >
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              {/* Supply Chain Name */}
              <div className="space-y-2 text-left">
                <label className="font-mono text-[11px] uppercase text-slate-300 tracking-wider block">
                  City
                </label>
                <input
                  placeholder="e.g. Pharma Cold-Chain Line"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#12172e]/80 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all shadow-inner text-sm"
                />
              </div>

              {/* Ward */}
              <div className="space-y-2 text-left">
                <label className="font-mono text-[11px] uppercase text-slate-300 tracking-wider block">
                  Ward / District
                </label>
                <input
                  placeholder="e.g. Ward 12"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-[#12172e]/80 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all shadow-inner text-sm"
                />
              </div>

              {/* Creators */}
              <div className="space-y-2 text-left">
                <label className="font-mono text-[11px] uppercase text-slate-300 tracking-wider block">
                  Owners
                </label>
                <input
                  placeholder="0x... (comma-separated)"
                  value={creators}
                  onChange={(e) => setCreators(e.target.value)}
                  className="w-full bg-[#12172e]/80 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all text-xs font-mono shadow-inner"
                />
              </div>

              {/* Committers */}
              <div className="space-y-2 text-left">
                <label className="font-mono text-[11px] uppercase text-slate-300 tracking-wider block">
                  Buyers
                </label>
                <input
                  placeholder="0x... (comma-separated)"
                  value={committers}
                  onChange={(e) => setCommitters(e.target.value)}
                  className="w-full bg-[#12172e]/80 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all text-xs font-mono shadow-inner"
                />
              </div>

              {/* Process Line */}
              <div className="md:col-span-2 space-y-4 pt-2 text-left">
                <label className="font-mono text-[11px] uppercase text-slate-300 tracking-wider block">
                  Reason for Purchase
                </label>

                <div className="space-y-3">
                  {processSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-center"
                    >
                      <span className="font-mono text-xs text-slate-500 w-6 text-right select-none shrink-0">
                        {idx + 1}.
                      </span>
                      <select
                        value={step}
                        onChange={(e) =>
                          handleProcessChange(idx, e.target.value)
                        }
                        className="flex-1 bg-[#12172e]/80 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-sm cursor-pointer"
                      >
                        <option value="">Select Role</option>
                        <option value="Resedential">Resedential</option>
                        <option value="Manufacturer">Manufacturer</option>
                        <option value="Supplier">Supplier</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Warehouse Owner">Warehouse Owner</option>
                        <option value="Retailer">Retailer</option>
                        <option value="Distributor">Distributor</option>
                  
                      </select>

                      {processSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(idx)}
                          className="px-4 py-3.5 text-xs font-mono text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all shrink-0"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addStep}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 px-4 py-2.5 rounded-xl transition-all active:scale-[0.98]"
                >
                  <span className="text-blue-400 text-sm font-bold">+</span> Add Step
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4.5 rounded-xl font-bold tracking-wider text-sm transition-all duration-300 shadow-lg ${
                loading
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-blue-500/20 hover:shadow-purple-500/30 active:scale-[0.99]"
              }`}
            >
              {loading ? "PROCESSING TRANSACTION..." : "DEPLOY SUPPLY CHAIN"}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Status Notification Toast */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-full font-mono text-xs tracking-wider shadow-2xl backdrop-blur-md border max-w-[90vw] text-center z-50 ${
              status.includes("❌")
                ? "bg-rose-950/90 text-rose-200 border-rose-800/80 shadow-rose-950/50"
                : "bg-gradient-to-r from-blue-950/90 to-purple-950/90 text-blue-200 border-blue-500/40 shadow-blue-950/60"
            }`}
          >
            {status}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}