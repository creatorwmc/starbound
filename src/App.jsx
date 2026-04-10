import { useState, useCallback, useMemo } from "react";
import { THEMES } from "./theme";
import { useItems } from "./hooks/useItems";
import { useMessages } from "./hooks/useMessages";
import { useTriggers } from "./hooks/useTriggers";
import FirstTimeSetup from "./components/FirstTimeSetup";
import NightSky from "./components/NightSky";
import BucketListView from "./components/BucketListView";
import ActivityFeed from "./components/ActivityFeed";
import TheHearth from "./components/TheHearth";
import OurHome from "./components/OurHome";
import HiddenGems from "./components/HiddenGems";
import SettingsView from "./components/SettingsView";
import NavMenu from "./components/NavMenu";
import AddItemModal from "./components/AddItemModal";
import ItemDetail from "./components/ItemDetail";
import AvatarCircle from "./components/AvatarCircle";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return localStorage.getItem("starbound_user") || null; } catch { return null; }
  });
  const [currentView, setCurrentView] = useState("sky");
  const [showMenu, setShowMenu] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({});
  const [immersive, setImmersive] = useState(false);
  const [timelineMode, setTimelineMode] = useState(false);

  // Firestore-backed hooks
  const { items, loading, addItem, updateItem, newStarId } = useItems();
  const { messages, sendMessage } = useMessages();
  const { triggers, plantTrigger } = useTriggers();

  const handleUserSelect = useCallback((user) => {
    setCurrentUser(user);
    try { localStorage.setItem("starbound_user", user); } catch {}
  }, []);

  const theme = currentUser ? THEMES[currentUser] : null;

  const activities = useMemo(() => {
    const acts = [];
    items.forEach((item) => {
      acts.push({
        type: "item_created",
        actor: item.createdBy,
        description: `Added "${item.title}" to the sky`,
        createdAt: item.createdAt,
        itemId: item.id,
      });
      if (item.completedAt) {
        acts.push({
          type: "item_completed",
          actor: item.completedBy,
          description: `Completed "${item.title}" ✦`,
          createdAt: item.completedAt,
          itemId: item.id,
        });
      }
      (item.notes || []).forEach((note) => {
        acts.push({
          type: "note_added",
          actor: note.by,
          description: `Added a note to "${item.title}"`,
          createdAt: note.at,
          itemId: item.id,
        });
      });
    });
    return acts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 30);
  }, [items]);

  const rememberThis = useMemo(() => {
    const doneItems = items.filter((i) => i.stage === "done" && i.notes?.length > 0);
    return doneItems.length > 0 ? doneItems[Math.floor(Math.random() * doneItems.length)] : null;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.stage && item.stage !== filters.stage) return false;
      if (filters.owner && item.owner !== filters.owner) return false;
      return true;
    });
  }, [items, filters]);

  const handleNavigate = useCallback((view) => {
    setCurrentView(view);
    setImmersive(false);
    setTimelineMode(false);
  }, []);

  const handleAddItem = (newItem) => {
    setShowAddItem(false);
    addItem(newItem).catch((err) => console.error("Failed to add item:", err));
  };

  const handleUpdateItem = (updated) => {
    setSelectedItem(updated);
    updateItem(updated).catch((err) => console.error("Failed to update item:", err));
  };

  if (!currentUser) {
    return (
      <div style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative" }}>
        <FirstTimeSetup onSelect={handleUserSelect} />
      </div>
    );
  }

  // Loading state while Firestore connects
  if (loading) {
    return (
      <div style={{
        width: "100%", height: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: theme.bg,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "28px", fontWeight: 800, letterSpacing: "4px",
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "12px",
          }}>
            STARBOUND
          </div>
          <div style={{ color: theme.textSecondary, fontSize: "13px", letterSpacing: "2px" }}>
            Loading your sky...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%", height: "100vh", overflow: "hidden", position: "relative",
      background: theme.bg, color: theme.textPrimary,
    }}>
      {/* Top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 12px", zIndex: 20,
        background: currentView === "sky" ? "transparent" : theme.bg,
        opacity: immersive ? 0 : 1,
        pointerEvents: immersive ? "none" : "auto",
        transition: "opacity 0.6s ease",
      }}>
        <button
          onClick={() => setShowMenu(true)}
          style={{
            background: "rgba(255,255,255,0.08)", border: "none",
            color: theme.textPrimary, fontSize: "18px", cursor: "pointer",
            width: "40px", height: "40px", borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          ☰
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {currentView === "sky" && !timelineMode && (
            <button
              onClick={() => setImmersive(true)}
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: theme.textSecondary, fontSize: "13px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
              title="Just the sky"
            >
              ✦
            </button>
          )}

          <span style={{
            fontSize: "16px", fontWeight: 700, letterSpacing: "2px",
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            STARBOUND
          </span>

          {currentView === "sky" && !timelineMode && (
            <button
              onClick={() => setTimelineMode(true)}
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: theme.textSecondary, fontSize: "14px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
              title="Sky Timeline"
            >
              ⏳
            </button>
          )}
        </div>

        <div
          onClick={() => handleNavigate("settings")}
          style={{
            width: "40px", height: "40px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}>
          <AvatarCircle user={currentUser} size={36} />
        </div>
      </div>

      {/* Main content */}
      <div style={{
        position: "absolute",
        top: immersive ? 0 : "56px",
        bottom: 0, left: 0, right: 0,
        overflow: "auto", transition: "top 0.6s ease",
      }}>
        {currentView === "sky" && (
          <NightSky
            items={filteredItems} theme={theme}
            onItemClick={(item) => setSelectedItem(item)}
            onAddNew={() => setShowAddItem(true)}
            onGoHome={() => handleNavigate("home")}
            rememberThis={rememberThis} filters={filters} setFilters={setFilters}
            immersive={immersive} onToggleImmersive={setImmersive}
            timelineMode={timelineMode} setTimelineMode={setTimelineMode}
            newStarId={newStarId}
          />
        )}
        {currentView === "list" && (
          <BucketListView items={items} theme={theme} onItemClick={(item) => setSelectedItem(item)} currentUser={currentUser} />
        )}
        {currentView === "feed" && <ActivityFeed activities={activities} theme={theme} />}
        {currentView === "jar" && <TheHearth messages={messages} theme={theme} currentUser={currentUser} onSend={sendMessage} />}
        {currentView === "home" && <OurHome theme={theme} currentUser={currentUser} />}
        {currentView === "gems" && <HiddenGems theme={theme} currentUser={currentUser} triggers={triggers} onPlant={plantTrigger} />}
        {currentView === "settings" && (
          <SettingsView theme={theme} currentUser={currentUser}
            onSwitchUser={() => { handleUserSelect(currentUser === "zach" ? "stacey" : "zach"); handleNavigate("sky"); }}
          />
        )}
      </div>

      {showMenu && <NavMenu theme={theme} currentView={currentView} onNavigate={handleNavigate} onClose={() => setShowMenu(false)} />}
      {showAddItem && <AddItemModal theme={theme} currentUser={currentUser} onSave={handleAddItem} onClose={() => setShowAddItem(false)} />}
      {selectedItem && (
        <ItemDetail item={selectedItem} theme={theme} currentUser={currentUser}
          onUpdate={handleUpdateItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
