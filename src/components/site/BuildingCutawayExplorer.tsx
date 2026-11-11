import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Sparkles,
  Building2,
  X,
  Eye,
  ArrowRight,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Bed,
  Maximize,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroExterior from "@/assets/hero-building.jpg";
import heroCutaway from "@/assets/hero-building-cutaway.jpg";
import masterFloorPlan from "@/assets/floorplans/seken-Floorplan.jpg";
import unit01Plan from "@/assets/floorplans/seken-1-bed-01.jpg";
import unit02Plan from "@/assets/floorplans/seken-3bed-02.jpg";
import unit03Plan from "@/assets/floorplans/seken-3-bed-03.jpg";
import unit04Plan from "@/assets/floorplans/seken-3bed-04.jpg";
import unit05Plan from "@/assets/floorplans/seken-3-bed-05.jpg";
import unit06Plan from "@/assets/floorplans/seken-3-bed-06.jpg";
import unit07Plan from "@/assets/floorplans/seken-3bed-07.jpg";
import unit08Plan from "@/assets/floorplans/seken-2bed-08.jpg";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type FloorPlanUnit = {
  id: string;
  code: string;
  title: string;
  beds: string;
  grossArea: string;
  netArea: string;
  levels: string;
  image: string;
  coords: { top: string; left: string };
};

const FLOOR_PLANS: FloorPlanUnit[] = [
  {
    id: "master",
    code: "ALL",
    title: "Master Floor Plan (Units 01–08)",
    beds: "1, 2 & 3 Beds",
    grossArea: "63 – 146 m²",
    netArea: "Full Floor Plate",
    levels: "Levels 03 – 19",
    image: masterFloorPlan,
    coords: { top: "16%", left: "79%" },
  },
  {
    id: "unit-01",
    code: "01",
    title: "Unit 01 — 1 Bedroom Suite",
    beds: "1 Bedroom",
    grossArea: "63.0 m²",
    netArea: "43.0 m²",
    levels: "Levels 03 – 19",
    image: unit01Plan,
    coords: { top: "26%", left: "74%" },
  },
  {
    id: "unit-08",
    code: "08",
    title: "Unit 08 — 2 Bedroom Suite",
    beds: "2 Bedrooms",
    grossArea: "86.0 m²",
    netArea: "64.0 m²",
    levels: "Levels 03 – 19",
    image: unit08Plan,
    coords: { top: "26%", left: "83%" },
  },
  {
    id: "unit-02",
    code: "02",
    title: "Unit 02 — 3 Bedroom Residence",
    beds: "3 Bedrooms",
    grossArea: "132.0 m²",
    netArea: "106.0 m²",
    levels: "Levels 03 – 19",
    image: unit02Plan,
    coords: { top: "36%", left: "74%" },
  },
  {
    id: "unit-03",
    code: "03",
    title: "Unit 03 — 3 Bedroom Corner",
    beds: "3 Bedrooms",
    grossArea: "146.0 m²",
    netArea: "117.0 m²",
    levels: "Levels 03 – 19",
    image: unit03Plan,
    coords: { top: "36%", left: "83%" },
  },
  {
    id: "unit-04",
    code: "04",
    title: "Unit 04 — 3 Bedroom Residence",
    beds: "3 Bedrooms",
    grossArea: "119.0 m²",
    netArea: "95.0 m²",
    levels: "Levels 03 – 19",
    image: unit04Plan,
    coords: { top: "47%", left: "74%" },
  },
  {
    id: "unit-05",
    code: "05",
    title: "Unit 05 — 3 Bedroom Residence",
    beds: "3 Bedrooms",
    grossArea: "114.0 m²",
    netArea: "90.0 m²",
    levels: "Levels 03 – 19",
    image: unit05Plan,
    coords: { top: "47%", left: "83%" },
  },
  {
    id: "unit-06",
    code: "06",
    title: "Unit 06 — 3 Bedroom Executive",
    beds: "3 Bedrooms",
    grossArea: "145.0 m²",
    netArea: "116.0 m²",
    levels: "Levels 03 – 19",
    image: unit06Plan,
    coords: { top: "59%", left: "74%" },
  },
  {
    id: "unit-07",
    code: "07",
    title: "Unit 07 — 3 Bedroom Residence",
    beds: "3 Bedrooms",
    grossArea: "126.0 m²",
    netArea: "100.0 m²",
    levels: "Levels 03 – 19",
    image: unit07Plan,
    coords: { top: "59%", left: "83%" },
  },
];

type TowerHoverBand = {
  id: string;
  floorTag: string;
  label: string;
  sublabel: string;
  areaBadge: string;
  top: string;
  height: string;
  unitIndex: number;
  previewImg: string;
};

const TOWER_HOVER_BANDS: TowerHoverBand[] = [
  {
    id: "band-roof",
    floorTag: "LEVEL T · ROOF",
    label: "Sky Terrace & Master Plate",
    sublabel: "8 Units Per Floor · 3 High-Speed Lifts",
    areaBadge: "63 – 146 m²",
    top: "7%",
    height: "9%",
    unitIndex: 0,
    previewImg: masterFloorPlan,
  },
  {
    id: "band-sky",
    floorTag: "LEVELS 15 – 19",
    label: "Sky Corner 3-Bed Residences",
    sublabel: "Units 03 & 06 · Panoramic City Views",
    areaBadge: "145 – 146 m²",
    top: "16%",
    height: "18%",
    unitIndex: 4,
    previewImg: unit03Plan,
  },
  {
    id: "band-upper",
    floorTag: "LEVELS 10 – 14",
    label: "Executive 3-Bed Apartments",
    sublabel: "Units 02, 04, 05 & 07 · Family Layouts",
    areaBadge: "114 – 132 m²",
    top: "34%",
    height: "19%",
    unitIndex: 3,
    previewImg: unit02Plan,
  },
  {
    id: "band-mid",
    floorTag: "LEVELS 06 – 09",
    label: "2-Bedroom Modern Suites",
    sublabel: "Unit 08 · Dual-Bath & Open Living",
    areaBadge: "86.0 m²",
    top: "53%",
    height: "14%",
    unitIndex: 2,
    previewImg: unit08Plan,
  },
  {
    id: "band-lower",
    floorTag: "LEVELS 03 – 05",
    label: "1-Bedroom Smart Suites",
    sublabel: "Unit 01 · High-Yield Investment Suite",
    areaBadge: "63.0 m²",
    top: "67%",
    height: "11%",
    unitIndex: 1,
    previewImg: unit01Plan,
  },
  {
    id: "band-podium",
    floorTag: "B + G – LEVEL 02",
    label: "Commercial Podium & Lobby",
    sublabel: "Retail Storefronts & Basement Parking",
    areaBadge: "Full Plate",
    top: "78%",
    height: "15%",
    unitIndex: 0,
    previewImg: masterFloorPlan,
  },
];

interface HeroInteractiveTowerProps {
  onSelectFloorUnit: (unitIndex: number) => void;
}

export function HeroInteractiveTower({ onSelectFloorUnit }: HeroInteractiveTowerProps) {
  const [hoveredBand, setHoveredBand] = useState<TowerHoverBand>(TOWER_HOVER_BANDS[1]);
  const [isHoveringTower, setIsHoveringTower] = useState(false);

  return (
    <div className="relative group w-full max-w-[460px]">
      {/* Ambient emerald glow behind card */}
      <div className="absolute -inset-2.5 rounded-3xl bg-primary/30 blur-2xl opacity-75 group-hover:opacity-100 transition duration-700" />

      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-zinc-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
                Interactive Floor Selector
              </span>
              <h3 className="font-display text-sm font-bold text-white">
                Lycee Seken · B+G+19+T Tower
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectFloorUnit(hoveredBand.unitIndex)}
            className="inline-flex items-center gap-1 rounded-full bg-primary/20 border border-primary/40 px-3 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
          >
            <Layers className="h-3 w-3" />
            <span>3D Blowout</span>
          </button>
        </div>

        {/* Interactive Tower Canvas with Glowing Horizontal Floor Bands */}
        <div
          className="relative mt-3.5 aspect-[4/4.3] w-full overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 select-none"
          onMouseEnter={() => setIsHoveringTower(true)}
          onMouseLeave={() => setIsHoveringTower(false)}
        >
          {/* Tower Image centered on the Lycee Seken high-rise */}
          <img
            src={heroExterior}
            alt="Lycee Seken Interactive Floor Selector"
            className="h-full w-full object-cover object-[54%_center] transition-transform duration-700"
          />

          {/* Subtle dark vignette so glowing floor bands pop */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 transition-opacity duration-300 ${
              isHoveringTower ? "opacity-90" : "opacity-65"
            }`}
          />

          {/* Horizontal Glowing Floor Bands Overlay */}
          <div className="absolute inset-x-0 inset-y-0 z-10">
            {TOWER_HOVER_BANDS.map((band) => {
              const active = hoveredBand.id === band.id;
              return (
                <button
                  key={band.id}
                  type="button"
                  onMouseEnter={() => setHoveredBand(band)}
                  onFocus={() => setHoveredBand(band)}
                  onClick={() => onSelectFloorUnit(band.unitIndex)}
                  style={{ top: band.top, height: band.height }}
                  className="group/band absolute left-[18%] right-[16%] flex items-center justify-between px-3 transition-all duration-200 cursor-pointer focus:outline-none"
                  aria-label={`Inspect ${band.floorTag} — ${band.label}`}
                >
                  {/* Glowing Laser Floor Highlight Box on the Building */}
                  <div
                    className={`absolute inset-0 rounded-lg transition-all duration-200 ${
                      active
                        ? "border-2 border-primary bg-primary/35 shadow-[0_0_25px_rgba(16,185,129,0.65)] scale-[1.02]"
                        : "border border-white/15 bg-white/5 hover:border-primary/60 hover:bg-primary/20"
                    }`}
                  />

                  {/* Left Floor Level Pill */}
                  <span
                    className={`relative z-10 -ml-14 sm:-ml-16 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase shadow-lg backdrop-blur-md transition-all duration-200 ${
                      active
                        ? "border-white bg-primary text-primary-foreground scale-105"
                        : "border-white/25 bg-black/75 text-white/80 opacity-85 group-hover/band:opacity-100"
                    }`}
                  >
                    {band.floorTag.split("·")[0].trim()}
                  </span>

                  {/* Right Area Tag */}
                  <span
                    className={`relative z-10 -mr-12 sm:-mr-14 rounded-full border px-2.5 py-0.5 text-[10px] font-bold shadow-lg backdrop-blur-md transition-all duration-200 ${
                      active
                        ? "border-primary bg-zinc-950/95 text-primary scale-105"
                        : "border-white/20 bg-black/70 text-white/75 opacity-75 group-hover/band:opacity-100"
                    }`}
                  >
                    {band.areaBadge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Instruction Pill at Top */}
          <div className="pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-full border border-white/20 bg-black/70 px-3 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-md">
            <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
            Hover floors to highlight · Click for Floor Plan
          </div>
        </div>

        {/* Live Floor-Plan Preview Dock (Updates dynamically as user hovers floors) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredBand.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            onClick={() => onSelectFloorUnit(hoveredBand.unitIndex)}
            className="mt-3.5 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 p-3 hover:border-primary/60 hover:bg-white/10 transition cursor-pointer group/dock"
          >
            {/* Mini Floor Plan Thumbnail */}
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white p-1">
              <img
                src={hoveredBand.previewImg}
                alt={hoveredBand.label}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  {hoveredBand.floorTag}
                </span>
                <span className="rounded bg-primary/20 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                  {hoveredBand.areaBadge}
                </span>
              </div>
              <div className="font-display text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                {hoveredBand.label}
              </div>
              <div className="text-[11px] text-white/70 truncate">{hoveredBand.sublabel}</div>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform group-hover/dock:scale-110">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

interface BuildingCutawayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialUnitIndex?: number;
}

export function BuildingCutawayModal({
  open,
  onOpenChange,
  initialUnitIndex = 1,
}: BuildingCutawayModalProps) {
  const [viewMode, setViewMode] = useState<"cutaway" | "exterior">("cutaway");
  const [activeIndex, setActiveIndex] = useState(initialUnitIndex);
  const [zoomedPlan, setZoomedPlan] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveIndex(initialUnitIndex);
    }
  }, [open, initialUnitIndex]);

  const activeUnit = FLOOR_PLANS[activeIndex] || FLOOR_PLANS[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + FLOOR_PLANS.length) % FLOOR_PLANS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FLOOR_PLANS.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[96vw] max-h-[94vh] overflow-y-auto border border-white/15 bg-zinc-950/95 p-0 text-white shadow-2xl backdrop-blur-2xl rounded-3xl [&>button]:hidden">
        <DialogTitle className="sr-only">
          Lycee Seken B+G+19+T — 3D Cutaway & Interactive Floor Plans
        </DialogTitle>

        {/* Top Control Bar */}
        <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-zinc-950/90 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Lycee Seken · B+G+19+T
                </span>
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Interactive Floor Plans
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                3D Building Blowout & Unit Floor Plans
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Toggle between Exterior & 3D Cutaway */}
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setViewMode("exterior")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  viewMode === "exterior"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Exterior</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cutaway")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  viewMode === "cutaway"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>3D Blowout</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-white/15 bg-white/5 p-2 text-white/80 transition hover:bg-white/15 hover:text-white cursor-pointer"
              aria-label="Close floor plan explorer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Interactive Split View: Left = 3D Building Blowout, Right = Visual Floor Plans */}
        <div className="grid lg:grid-cols-[1.15fr_1.35fr]">
          {/* Left: Interactive 3D Building Canvas with Unit Hotspots */}
          <div className="relative aspect-[16/11] lg:aspect-auto lg:min-h-[580px] w-full overflow-hidden bg-zinc-900 select-none">
            <AnimatePresence mode="wait">
              {viewMode === "cutaway" ? (
                <motion.div
                  key="cutaway-image"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full w-full"
                >
                  <img
                    src={heroCutaway}
                    alt="Lycee Seken 3D Architectural Cutaway"
                    className="h-full w-full object-cover"
                  />

                  {/* Interactive Unit Hotspots on Cutaway Floors */}
                  {FLOOR_PLANS.map((unit, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <button
                        key={unit.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        style={{ top: unit.coords.top, left: unit.coords.left }}
                        className="group/pin absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-none"
                        aria-label={`View ${unit.title} Floor Plan`}
                      >
                        <span
                          className={`absolute -inset-2 rounded-full transition-all duration-300 ${
                            isSelected
                              ? "animate-ping bg-primary/70"
                              : "bg-primary/30 opacity-0 group-hover/pin:opacity-100"
                          }`}
                        />
                        <span
                          className={`relative flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-xl backdrop-blur-md transition-all duration-200 ${
                            isSelected
                              ? "scale-110 border-white bg-primary text-primary-foreground ring-4 ring-primary/30"
                              : "border-white/40 bg-black/80 text-white hover:scale-105 hover:border-primary"
                          }`}
                        >
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span>{unit.code === "ALL" ? "ALL" : `U-${unit.code}`}</span>
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="exterior-image"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full w-full cursor-pointer group"
                  onClick={() => setViewMode("cutaway")}
                >
                  <img
                    src={heroExterior}
                    alt="Lycee Seken Exterior Tower"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition group-hover:bg-black/40">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/75 px-6 py-3 text-sm font-bold text-white backdrop-blur-xl shadow-2xl transition group-hover:scale-105">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Click Tower to Reveal 3D Blowout & Floor Plans
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Caption Strip */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/70 px-4 py-2 text-[11px] text-white/85 backdrop-blur-md">
              <span>Click any unit pin on the 3D cutaway to switch floor plans</span>
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "cutaway" ? "exterior" : "cutaway")}
                className="font-bold text-primary hover:underline ml-3 shrink-0 cursor-pointer"
              >
                {viewMode === "cutaway" ? "View Exterior →" : "View 3D Blowout →"}
              </button>
            </div>
          </div>

          {/* Right: Interactive Visual Floor Plan Popout */}
          <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-zinc-950 p-5 sm:p-6">
            <div>
              {/* Unit Filter Pills */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                  Select Unit Floor Plan
                </span>
                <span className="text-xs font-semibold text-primary">{activeUnit.levels}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {FLOOR_PLANS.map((u, idx) => {
                  const active = activeIndex === idx;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-white/10 bg-white/5 text-white/75 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {u.code === "ALL"
                        ? "All Floor Plan"
                        : `Unit ${u.code} (${u.beds.split(" ")[0]}B)`}
                    </button>
                  );
                })}
              </div>

              {/* Active Unit Compact Spec Header */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <h4 className="font-display text-base sm:text-lg font-bold text-white">
                    {activeUnit.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-primary/20 px-2.5 py-1 font-bold text-primary">
                    <Bed className="h-3.5 w-3.5" /> {activeUnit.beds}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 font-bold text-white">
                    <Maximize className="h-3.5 w-3.5 text-primary" /> {activeUnit.grossArea}
                  </span>
                </div>
              </div>

              {/* Visual 2D + 3D Floor Plan Canvas */}
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/15 bg-white p-3 shadow-inner group/plan">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeUnit.id}
                    src={activeUnit.image}
                    alt={activeUnit.title}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onClick={() => setZoomedPlan(true)}
                    className="mx-auto h-[320px] sm:h-[360px] w-full object-contain cursor-zoom-in"
                  />
                </AnimatePresence>

                {/* Prev / Next Navigation Arrows */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white shadow-md backdrop-blur transition hover:bg-primary cursor-pointer"
                  aria-label="Previous floor plan"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white shadow-md backdrop-blur transition hover:bg-primary cursor-pointer"
                  aria-label="Next floor plan"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Fullscreen Zoom Button */}
                <button
                  type="button"
                  onClick={() => setZoomedPlan(true)}
                  className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur transition hover:bg-primary cursor-pointer"
                >
                  <Maximize2 className="h-3 w-3" />
                  <span>Enlarge Floor Plan</span>
                </button>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/properties"
                search={{ type: "Residential" }}
                onClick={() => onOpenChange(false)}
                className="btn-primary w-full justify-center py-3 text-xs font-bold"
              >
                <span>Inquire About {activeUnit.title}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Fullscreen Zoomed Floor Plan Lightbox */}
        <Dialog open={zoomedPlan} onOpenChange={setZoomedPlan}>
          <DialogContent className="max-w-5xl w-[95vw] border-white/20 bg-white p-4 sm:p-6 rounded-3xl shadow-2xl">
            <DialogTitle className="font-display text-lg font-bold text-zinc-900">
              {activeUnit.title} — {activeUnit.grossArea} ({activeUnit.levels})
            </DialogTitle>
            <div className="relative mt-2 flex items-center justify-center overflow-hidden rounded-2xl bg-white">
              <img
                src={activeUnit.image}
                alt={activeUnit.title}
                className="max-h-[78vh] w-auto object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
