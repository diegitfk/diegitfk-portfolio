"use client"

import { motion } from "framer-motion";
import Link from "next/link";

const metrics = [
  { label: "CTR Promedio", value: "8.4%", delta: "+2.1%", color: "#4ade80" },
  { label: "Quality Score", value: "9/10", delta: "+3pts", color: "#60a5fa" },
  { label: "Conv. Rate", value: "12.7%", delta: "+4.3%", color: "#a78bfa" },
  { label: "CPC Opt.", value: "$0.38", delta: "-22%", color: "#fb923c" },
];

const funnelStages = [
  { label: "Impresiones", value: "124K", width: "100%" },
  { label: "Clics", value: "10.4K", width: "75%" },
  { label: "Leads", value: "1.3K", width: "50%" },
  { label: "Conversiones", value: "320", width: "28%" },
];

export function GoogleAdsCard() {
  return (
    <div className="relative w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
        </div>
        <span className="text-xs text-gray-400 font-medium tracking-wide">Google Ads Dashboard</span>
      </div>

      {/* metrics grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            className="bg-white/5 border border-white/8 rounded-xl p-3"
          >
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-xl font-bold text-white">{m.value}</p>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: m.color }}>{m.delta}</p>
          </motion.div>
        ))}
      </div>

      {/* funnel */}
      <div className="space-y-2">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Embudo de Ventas</p>
        {funnelStages.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400 w-24 shrink-0">{stage.label}</span>
            <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, #4285F4 0%, #34A853 100%)`,
                  opacity: 1 - i * 0.15,
                }}
                initial={{ width: "0%" }}
                animate={{ width: stage.width }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <span className="text-[11px] text-gray-300 w-10 text-right shrink-0">{stage.value}</span>
          </div>
        ))}
      </div>

      {/* SEO badge */}
      <div className="mt-4 flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
        <div className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
        <span className="text-[11px] text-gray-300">SEO On-Page optimizado · Landing Score <strong className="text-white">94/100</strong></span>
      </div>

      {/* case study */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mt-4"
      >
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Caso de Uso Real</p>
        <Link
          href="https://sisamedica.cl"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between bg-white/5 border border-white/10 hover:border-[#4285F4]/40 hover:bg-[#4285F4]/5 rounded-xl px-3 py-2.5 transition-all duration-300"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-white">SISA Médica</p>
              <p className="text-[10px] text-gray-500">Campañas Search · SEO On-Page · OCT</p>
            </div>
          </div>
          <span className="text-gray-500 group-hover:text-[#4285F4] transition-colors duration-300 text-sm">→</span>
        </Link>
      </motion.div>

      {/* ambient glow */}
      <div
        className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(66,133,244,0.15) 0%, transparent 70%)" }}
      />
    </div>
  );
}
