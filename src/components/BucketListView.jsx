import { useState } from "react";
import { THEMES, CATEGORIES, TIERS, STAGES } from "../theme";
import FilterChip from "./FilterChip";

export default function BucketListView({ items, theme, onItemClick }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    if (filter !== "all" && item.stage !== filter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage.id] = filtered.filter((i) => i.stage === stage.id);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 700, margin: "0 0 16px 0" }}>
        Our Bucket List
      </h2>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search dreams..."
        style={{
          width: "100%", padding: "12px", borderRadius: "12px",
          border: `1px solid ${theme.cardBorder}`, background: theme.cardBg,
          color: theme.textPrimary, fontSize: "14px",
          marginBottom: "12px", outline: "none", boxSizing: "border-box",
        }}
      />

      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
        <FilterChip label="All" active={filter === "all"} theme={theme} onClick={() => setFilter("all")} />
        {STAGES.map((s) => (
          <FilterChip key={s.id} label={`${s.icon} ${s.label}`} active={filter === s.id} theme={theme} onClick={() => setFilter(s.id)} />
        ))}
      </div>

      {STAGES.filter((s) => filter === "all" || filter === s.id).map((stage) => {
        const stageItems = grouped[stage.id] || [];
        if (stageItems.length === 0) return null;
        return (
          <div key={stage.id} style={{ marginBottom: "24px" }}>
            <h3 style={{
              color: stage.color, fontSize: "12px",
              textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px",
            }}>
              {stage.icon} {stage.label} ({stageItems.length})
            </h3>
            {stageItems.map((item) => {
              const cat = CATEGORIES.find((c) => c.id === item.category);
              const tier = TIERS.find((t) => t.id === item.tier);
              return (
                <div
                  key={item.id}
                  onClick={() => onItemClick(item)}
                  style={{
                    padding: "14px", borderRadius: "12px",
                    background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                    marginBottom: "8px", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ color: theme.textPrimary, fontSize: "15px", fontWeight: 600 }}>
                      {item.title}
                    </div>
                    <div style={{ color: theme.textSecondary, fontSize: "11px", marginTop: "4px" }}>
                      {cat?.icon} {cat?.label} • {tier?.icon} {item.owner === "shared" ? "Ours" : THEMES[item.owner]?.name}
                    </div>
                  </div>
                  <div style={{ color: stage.color, fontSize: "18px" }}>{stage.icon}</div>
                </div>
              );
            })}
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: theme.textSecondary }}>
          {search ? "No dreams match that search" : "No dreams yet — time to start dreaming"}
        </div>
      )}
    </div>
  );
}
