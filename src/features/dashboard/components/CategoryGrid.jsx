import React from "react";
import PropTypes from "prop-types";
import {
  Cpu,
  Utensils,
  Brain,
  Palette,
  Leaf,
  Dumbbell,
  HeartPulse,
  Coins,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap = {
  teknologi: Cpu,
  makanan: Utensils,
  ai: Brain,
  seni: Palette,
  iklim: Leaf,
  kebugaran: Dumbbell,
  kesehatan: HeartPulse,
  kripto: Coins,
};

const accentColorMap = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
};

function randomPastelColor() {
  const hues = [20, 45, 90, 140, 180, 225, 270, 315];
  const h = hues[Math.floor(Math.random() * hues.length)];
  const s = 70; // moderate saturation for readability
  const l = 86; // light for pastel
  return `hsl(${h} ${s}% ${l}%)`;
}

function CategoryTile({ label, countText, icon, accent, onClick }) {
  const Icon = iconMap[icon] || Cpu;
  const accentCls = accent && accentColorMap[accent] ? accentColorMap[accent] : null;
  const pastel = React.useMemo(() => randomPastelColor(), []);
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors duration-200 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${accentCls ? "text-primary-foreground " + accentCls : "text-gray-900"}`}
        style={!accentCls ? { backgroundColor: pastel } : undefined}
      >
        {icon}
        {/* <Icon size={20} strokeWidth={2} /> */}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-card-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{countText ? `${countText} Event` : "No upcoming events"}</p>
      </div>
    </button>
  );
}

CategoryTile.propTypes = {
  label: PropTypes.string.isRequired,
  countText: PropTypes.string.isRequired,
  icon: PropTypes.string,
  accent: PropTypes.string,
};

export default function CategoryGrid({ title = "Browse by Vibe", categories }) {
  const navigate = useNavigate();
  return (
    <section className="rounded-2xl bg-card py-6">
      <h3 className="mb-4 text-2xl font-semibold text-card-foreground">{title}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories?.length ? (
          categories.map((c, idx) => (
            <CategoryTile key={idx} label={c.name} countText={c._count?.rooms} icon={c.icon} accent={c.accent} onClick={() => navigate(`/home/category/${c.slug}`)} />
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Kategori belum tersedia.
          </div>
        )}
      </div>
    </section>
  );
}

CategoryGrid.propTypes = {
  title: PropTypes.string,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      countText: PropTypes.string.isRequired,
      icon: PropTypes.string,
      accent: PropTypes.string,
    })
  ),
};