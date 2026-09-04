import { useState } from "react";
import AppShell from "../kit/AppShell";
import SimpleHeader from "../kit/SimpleHeader";
import TabBar from "../kit/TabBar";
import BottomDrawer from "../kit/BottomDrawer";

const STAR_ICON = <span style={{ fontSize: "20px", lineHeight: 1 }}>✦</span>;

const TABS = [
  { id: "sky", label: "Sky", icon: <span style={{ fontSize: "18px", lineHeight: 1 }}>✦</span> },
  { id: "home", label: "Home", icon: <span style={{ fontSize: "18px", lineHeight: 1 }}>⌂</span> },
  { id: "list", label: "List", icon: <span style={{ fontSize: "18px", lineHeight: 1 }}>≡</span> },
  { id: "jar", label: "Hearth", icon: <span style={{ fontSize: "18px", lineHeight: 1 }}>♡</span> },
];

const TAB_IDS = new Set(TABS.map((t) => t.id));

function kitVarsFromTheme(theme) {
  return {
    "--kit-surface": "rgba(0, 0, 0, 0.65)",
    "--kit-surface-2": "rgba(15, 10, 25, 0.9)",
    "--kit-border": theme.cardBorder,
    "--kit-text": theme.textPrimary,
    "--kit-text-secondary": theme.textSecondary,
    "--kit-text-muted": "rgba(255,255,255,0.35)",
    "--kit-accent": theme.primary,
    "--kit-danger": "#c45f5f",
    "--font-kit-sans": "'Inter', system-ui, sans-serif",
    "--font-kit-mono": "'Inter', system-ui, sans-serif",
  };
}

const WRENCH_ICON = <span style={{ fontSize: "18px", lineHeight: 1 }}>&#x1F527;</span>;

export default function AppChrome({ children, theme, currentView, onNavigate, showFeedbackTab, onToggleFeedbackTab }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tabs = [
    ...TABS,
    ...(showFeedbackTab ? [{ id: "feedback", label: "Feedback", icon: WRENCH_ICON }] : []),
  ];

  const allTabIds = new Set(tabs.map((t) => t.id));
  const activeTab = allTabIds.has(currentView) ? currentView : null;

  const header = (
    <SimpleHeader
      appName="Starbound"
      appIcon={STAR_ICON}
      onHome={() => onNavigate("sky")}
      onSettings={() => setDrawerOpen(true)}
    />
  );

  function handleTabChange(tabId) {
    if (tabId === "feedback") { window.dispatchEvent(new Event("workbench:open")); return; }
    onNavigate(tabId);
  }

  const footer = (
    <TabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
  );

  return (
    <div style={{ height: "100dvh", background: theme.bg, color: theme.textPrimary, ...kitVarsFromTheme(theme) }}>
      <AppShell header={header} footer={footer}>
        {children}
      </AppShell>

      <BottomDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="More">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <DrawerLink onClick={() => { setDrawerOpen(false); onNavigate("feed"); }}>
            Activity feed
          </DrawerLink>
          <DrawerLink onClick={() => { setDrawerOpen(false); onNavigate("gems"); }}>
            Hidden gems
          </DrawerLink>
          <button
            type="button"
            onClick={() => onToggleFeedbackTab(!showFeedbackTab)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", gap: 12,
              background: "transparent", border: 0, padding: "12px 4px",
              color: "var(--kit-text)", cursor: "pointer", fontSize: 14,
              fontFamily: "var(--font-kit-sans)",
            }}
          >
            <span>&#x1F527; Feedback tab</span>
            <span style={{
              fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
              color: showFeedbackTab ? theme.primary : "var(--kit-text-muted)",
            }}>
              {showFeedbackTab ? "On" : "Off"}
            </span>
          </button>
          <DrawerLink onClick={() => { setDrawerOpen(false); onNavigate("settings"); }}>
            Settings
          </DrawerLink>
        </div>
      </BottomDrawer>
    </div>
  );
}

function DrawerLink({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "transparent", border: 0, padding: "12px 4px",
        color: "var(--kit-text)", cursor: "pointer", fontSize: 14,
        fontFamily: "var(--font-kit-sans)",
      }}
    >
      {children}
    </button>
  );
}
