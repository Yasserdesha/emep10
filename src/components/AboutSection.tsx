"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import { Button } from "@/components/ui/button";
import SpecularButton from "@/components/SpecularButton";

interface Discipline {
  id: "hvac" | "elec" | "plumb" | "fire";
  icon: string;
  titleKey: string;
  descKey: string;
  specsEn: string[];
  specsAr: string[];
  tag: string;
}

const DISCIPLINES: Discipline[] = [
  {
    id: "hvac",
    icon: "fa-fan",
    titleKey: "feat_hvac_title",
    descKey: "feat_hvac_desc",
    specsEn: ["VRF / Chilled Water Systems", "Air Handling & Fresh Air Units", "Smoke Evacuation & Ducts"],
    specsAr: ["أنظمة VRF والشيلرات المبردة", "وحدات معالجة وتجديد الهواء", "شبكات تصريف وسحب الدخان"],
    tag: "HVAC Engineering",
  },
  {
    id: "elec",
    icon: "fa-bolt",
    titleKey: "feat_elec_title",
    descKey: "feat_elec_desc",
    specsEn: ["Medium & Low Voltage Networks", "Transformers & Switchgears", "Smart BMS & Low Current"],
    specsAr: ["شبكات الجهد المتوسط والمنخفض", "المحولات ولوحات التوزيع الرئيسية", "أنظمة التحكم الذكي والتيار الخفيف"],
    tag: "Power & Systems",
  },
  {
    id: "plumb",
    icon: "fa-faucet-drip",
    titleKey: "feat_plumb_title",
    descKey: "feat_plumb_desc",
    specsEn: ["Potable Water Supply Networks", "Drainage & Venting Systems", "Water Treatment & Pumps"],
    specsAr: ["شبكات تغذية المياه النقية", "أنظمة الصرف الصحي والتهوية", "محطات المعالجة ومجموعات الرفع"],
    tag: "Plumbing & Drainage",
  },
  {
    id: "fire",
    icon: "fa-fire-extinguisher",
    titleKey: "feat_fire_title",
    descKey: "feat_fire_desc",
    specsEn: ["NFPA Standard Sprinkler Networks", "FM200 & Clean Agent Suppression", "Fire Pumps & Standpipes"],
    specsAr: ["شبكات الرشاشات طبقاً لكود NFPA", "أنظمة الإطفاء بالغازات النظيفة FM200", "طلمبات الحريق وشبكات الهيدرنت"],
    tag: "Fire Protection",
  },
];

export function AboutSection() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const [activeDiscipline, setActiveDiscipline] = useState<Discipline["id"]>("hvac");

  const currentDisc = DISCIPLINES.find((d) => d.id === activeDiscipline) || DISCIPLINES[0];

  return (
    <section 
      className="about-section section-padding relative overflow-hidden bg-[#0A0A0E]" 
      id="about" 
      aria-labelledby="about-title-heading"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#FF1E27]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-[#FF1E27]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Trust & Performance Metrics Strip (Interactive Bento Stats) */}
      <div className="container mb-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          <div className="group p-3.5 sm:p-6 rounded-2xl bg-[#121217]/90 border border-white/[0.08] backdrop-blur-xl text-center shadow-xl hover:border-[#FF1E27]/50 hover:shadow-[0_12px_35px_rgba(211,16,25,0.25)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF1E27] font-mono group-hover:scale-105 transition-transform duration-300">
              2019+
            </div>
            <div className="text-[10px] sm:text-xs text-[#94A3B8] font-bold uppercase tracking-wider mt-1.5 sm:mt-2 group-hover:text-white transition-colors">
              {isAr ? "سنة التأسيس والخبرة" : "Founded Year"}
            </div>
          </div>

          <div className="group p-3.5 sm:p-6 rounded-2xl bg-[#121217]/90 border border-white/[0.08] backdrop-blur-xl text-center shadow-xl hover:border-[#FF1E27]/50 hover:shadow-[0_12px_35px_rgba(211,16,25,0.25)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF1E27] font-mono group-hover:scale-105 transition-transform duration-300">
              100+
            </div>
            <div className="text-[10px] sm:text-xs text-[#94A3B8] font-bold uppercase tracking-wider mt-1.5 sm:mt-2 group-hover:text-white transition-colors">
              {isAr ? "مشروع هندسي مكتمل" : "Completed Projects"}
            </div>
          </div>

          <div className="group p-3.5 sm:p-6 rounded-2xl bg-[#121217]/90 border border-white/[0.08] backdrop-blur-xl text-center shadow-xl hover:border-[#FF1E27]/50 hover:shadow-[0_12px_35px_rgba(211,16,25,0.25)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF1E27] font-mono group-hover:scale-105 transition-transform duration-300">
              LOD 500
            </div>
            <div className="text-[10px] sm:text-xs text-[#94A3B8] font-bold uppercase tracking-wider mt-1.5 sm:mt-2 group-hover:text-white transition-colors">
              {isAr ? "دقة نمذجة الـ BIM" : "BIM Precision"}
            </div>
          </div>

          <div className="group p-3.5 sm:p-6 rounded-2xl bg-[#121217]/90 border border-white/[0.08] backdrop-blur-xl text-center shadow-xl hover:border-[#FF1E27]/50 hover:shadow-[0_12px_35px_rgba(211,16,25,0.25)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF1E27] font-mono group-hover:scale-105 transition-transform duration-300">
              100%
            </div>
            <div className="text-[10px] sm:text-xs text-[#94A3B8] font-bold uppercase tracking-wider mt-1.5 sm:mt-2 group-hover:text-white transition-colors">
              {isAr ? "مطابقة للأكواد الهندسية" : "Code Compliance"}
            </div>
          </div>
        </div>
      </div>

      <div className="container relative z-10">
        {/* Main 2-Column About Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          
          {/* Left / Brand Seal Column */}
          <div className="lg:col-span-5">
            <div className="brand-showcase-box glass-panel white-logo-bg shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-[#FF1E27]/50 hover:shadow-[0_0_50px_rgba(255,30,39,0.25)] transition-all duration-500">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FF1E27]/20 rounded-full blur-3xl group-hover:bg-[#FF1E27]/30 transition-all" />
              <Image 
                src="/logo/logo.png" 
                alt={isAr ? "علامة الجودة الكهروميكانيكية E-MEP" : "E-MEP High Quality Standard MEP"} 
                width={220}
                height={220}
                className="about-logo-hero mx-auto object-contain group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="badge-tag mt-6 flex items-center justify-center gap-2" role="status">
                <i className="fa-solid fa-shield-halved text-[#FF1E27]" aria-hidden="true"></i>
                <span className="font-bold">{t("about_tag")}</span>
              </div>
            </div>
          </div>

          {/* Right / Narrative Column */}
          <div className="lg:col-span-7">
            <div className="section-tag inline-flex items-center gap-2 mb-3">
              <span>{t("about_section_tag")}</span>
            </div>
            
            <h2 
              id="about-title-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 text-white leading-tight"
            >
              {t("about_title")}
            </h2>

            <p 
              className="mb-4 text-[#94A3B8] leading-relaxed text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: t("about_desc1") }}
            />
            <p 
              className="mb-6 text-[#94A3B8] leading-relaxed text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: t("about_desc2") }}
            />
          </div>

        </div>

        {/* Interactive MEP Disciplines Bento Showcase */}
        <div className="rounded-3xl bg-[#111116]/80 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 lg:p-10 mb-16 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-bold text-[#FF1E27] uppercase tracking-widest">
                {isAr ? "تخصصاتنا الهندسية المتكاملة" : "Our Integrated MEP Disciplines"}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {isAr ? "اختر التخصص للاطلاع على نطاق العمل" : "Select Discipline to Explore Scope"}
              </h3>
            </div>

            {/* Switcher Buttons with SpecularButton */}
            <div className="flex flex-wrap gap-2.5">
              {DISCIPLINES.map((disc) => {
                const isActive = disc.id === activeDiscipline;
                return (
                  <SpecularButton
                    key={disc.id}
                    type="button"
                    size="sm"
                    radius={16}
                    lineColor={isActive ? "#FF1E27" : "#64748B"}
                    baseColor={isActive ? "#521014" : "#1a1a24"}
                    intensity={isActive ? 1.3 : 0.8}
                    shineSize={12}
                    shineFade={35}
                    thickness={1.5}
                    speed={0.4}
                    followMouse
                    autoAnimate
                    onClick={() => setActiveDiscipline(disc.id)}
                    className={`font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "shadow-[0_0_20px_rgba(255,30,39,0.35)] scale-[1.02]"
                        : "bg-white/[0.03] text-[#94A3B8]"
                    }`}
                  >
                    <i className={`fa-solid ${disc.icon}`} aria-hidden="true"></i>
                    <span>{t(disc.titleKey)}</span>
                  </SpecularButton>
                );
              })}
            </div>
          </div>

          {/* Active Discipline Deep Dive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in zoom-in-95 duration-300">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1E27]/10 text-[#FF1E27] text-xs font-bold mb-4 border border-[#FF1E27]/20">
                <i className={`fa-solid ${currentDisc.icon}`} aria-hidden="true"></i>
                <span>{currentDisc.tag}</span>
              </div>
              <h4 className="text-2xl font-extrabold text-white mb-3">
                {t(currentDisc.titleKey)}
              </h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">
                {t(currentDisc.descKey)}
              </p>
            </div>

            {/* Technical Scope Checklist */}
            <div className="bg-[#0A0A0D] border border-white/[0.08] rounded-2xl p-6">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <i className="fa-solid fa-list-check text-[#FF1E27]" aria-hidden="true"></i>
                <span>{isAr ? "المعايير والنطاق التنفيذي" : "Execution & Technical Standards"}</span>
              </h5>
              <div className="space-y-3">
                {(isAr ? currentDisc.specsAr : currentDisc.specsEn).map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-[#CBD5E1]">
                    <div className="w-5 h-5 rounded-full bg-[#FF1E27]/15 border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27] text-xs flex-shrink-0">
                      <i className="fa-solid fa-check" aria-hidden="true"></i>
                    </div>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pillars Grid (Elevated Bento Vision/Mission/Values Cards) */}
        <div className="pillars-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="pillar-card group glass-panel bg-[#111116]/90 border border-white/[0.08] hover:border-[#FF1E27]/50 hover:shadow-[0_12px_35px_rgba(211,16,25,0.2)] p-8 rounded-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
            <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-[#FF1E27] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="pillar-icon red-glow text-[#FF1E27] mb-4 text-2xl group-hover:scale-110 transition-transform"><i className="fa-solid fa-bullseye" aria-hidden="true"></i></div>
            <h3 className="font-bold text-lg text-white mb-2 group-hover:text-[#FF1E27] transition-colors">{t("mission_title")}</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">{t("mission_desc")}</p>
          </div>

          <div className="pillar-card group glass-panel bg-[#111116]/90 border border-white/[0.08] hover:border-[#FF1E27]/50 hover:shadow-[0_12px_35px_rgba(211,16,25,0.2)] p-8 rounded-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
            <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-[#FF1E27] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="pillar-icon red-glow text-[#FF1E27] mb-4 text-2xl group-hover:scale-110 transition-transform"><i className="fa-solid fa-eye" aria-hidden="true"></i></div>
            <h3 className="font-bold text-lg text-white mb-2 group-hover:text-[#FF1E27] transition-colors">{t("vision_title")}</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">{t("vision_desc")}</p>
          </div>

          <div className="pillar-card group glass-panel bg-[#111116]/90 border border-white/[0.08] hover:border-[#FF1E27]/50 hover:shadow-[0_12px_35px_rgba(211,16,25,0.2)] p-8 rounded-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
            <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-[#FF1E27] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="pillar-icon red-glow text-[#FF1E27] mb-4 text-2xl group-hover:scale-110 transition-transform"><i className="fa-solid fa-gem" aria-hidden="true"></i></div>
            <h3 className="font-bold text-lg text-white mb-2 group-hover:text-[#FF1E27] transition-colors">{t("values_title")}</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">{t("values_desc")}</p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutSection;
