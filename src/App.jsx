import { useState, useCallback, useEffect, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, userKeyForEmail } from "./firebase";
import { THEMES } from "./theme";
import { HospitalityProvider, WelcomeMoment, createFirestoreStorage } from "./hospitality";

const hospitalityStorage = createFirestoreStorage(db);
import { useItems } from "./hooks/useItems";
import { useMessages } from "./hooks/useMessages";
import AppChrome from "./components/AppChrome";
import FeedbackButton from "./lib/workbench/FeedbackButton";
import {
  getKairosMembership,
  clearKairosMembershipCache,
  readCachedMembership,
} from "./lib/kairosHandshake";
import { useTriggers } from "./hooks/useTriggers";
import { useConstellations } from "./hooks/useConstellations";
import { useSkyPrefs } from "./hooks/useSkyPrefs";
import FirstTimeSetup from "./components/FirstTimeSetup";
import ConstellationCelebration from "./components/ConstellationCelebration";
import NightSky from "./components/NightSky";
import BucketListView from "./components/BucketListView";
import ActivityFeed from "./components/ActivityFeed";
import TheHearth from "./components/TheHearth";
import OurHome from "./components/OurHome";
import HiddenGems from "./components/HiddenGems";
import SettingsView from "./components/SettingsView";
import AddItemModal from "./components/AddItemModal";
import ItemDetail from "./components/ItemDetail";
import StaceyIntro from "./components/StaceyIntro";
import BroadcastBanner from "./components/BroadcastBanner";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authUid, setAuthUid] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const key = user ? userKeyForEmail(user.email) : null;
      setCurrentUser(key);
      setAuthUid(user?.uid || null);
      // Retained for the Kairos handshake, which needs a live getIdToken().
      setAuthUser(user || null);
      if (!user) clearKairosMembershipCache();
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  if (!authReady) {
    return (
      <div style={{
        width: "100%", height: "100dvh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0c0c2e 0%, #1a0f2e 50%, #1a0c0c 100%)",
      }} />
    );
  }

  if (!currentUser) {
    return (
      <div style={{ width: "100%", height: "100dvh", overflow: "hidden", position: "relative" }}>
        <FirstTimeSetup />
      </div>
    );
  }

  return <AuthedApp currentUser={currentUser} uid={authUid} user={authUser} />;
}

const WORKBENCH_ENDPOINT = "https://kairos-pwa.netlify.app/.netlify/functions/workbench-submit";

function AuthedApp({ currentUser, uid, user }) {
  const [kairosMembership, setKairosMembership] = useState(
    () => readCachedMembership(user?.email)
  );

  // Golden Ticket check. Non-blocking: a non-member — or an unreachable
  // Kairos — leaves this null and Starbound stays exactly as it is.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getKairosMembership(user).then((m) => {
      if (!cancelled) setKairosMembership(m);
    });
    return () => { cancelled = true; };
  }, [user]);

  const [showFeedbackTab, setShowFeedbackTab] = useState(() => {
    try { return localStorage.getItem("starbound_show_feedback_tab") === "true"; } catch { return false; }
  });
  const toggleFeedbackTab = (on) => {
    setShowFeedbackTab(on);
    try { localStorage.setItem("starbound_show_feedback_tab", on ? "true" : "false"); } catch {}
  };
  const [showStaceyIntro, setShowStaceyIntro] = useState(() => {
    if (currentUser !== "stacey") return false;
    try { return !localStorage.getItem("starbound_stacey_intro_seen"); } catch { return false; }
  });
  const [currentView, setCurrentView] = useState("sky");
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({});
  const [immersive, setImmersive] = useState(false);
  const [timelineMode, setTimelineMode] = useState(false);

  // Firestore-backed hooks (only mounted after sign-in)
  const { items, loading, addItem, updateItem, deleteItem, newStarId } = useItems();
  const { messages, sendMessage } = useMessages();
  const { triggers, plantTrigger } = useTriggers();
  const { prefs, setConstellationMode } = useSkyPrefs();
  const { clusterPositions, skeletons, newConstellation } = useConstellations(items, prefs.constellationMode);

  const theme = THEMES[currentUser];

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

  // Loading state while Firestore connects
  if (loading) {
    return (
      <div style={{
        width: "100%", height: "100dvh", display: "flex",
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
    <HospitalityProvider
      appId="starbound"
      uid={uid}
      storage={hospitalityStorage}
      WelcomeMoment={WelcomeMoment}
      welcomeTourId="starbound-main"
    >
      {immersive ? (
        <div style={{
          width: "100%", height: "100dvh", overflow: "hidden",
          position: "relative", background: theme.bg, color: theme.textPrimary,
        }}>
          <NightSky
            items={filteredItems} theme={theme}
            onItemClick={(item) => setSelectedItem(item)}
            onAddNew={() => setShowAddItem(true)}
            onGoHome={() => handleNavigate("home")}
            rememberThis={rememberThis} filters={filters} setFilters={setFilters}
            immersive={true} onToggleImmersive={setImmersive}
            timelineMode={timelineMode} setTimelineMode={setTimelineMode}
            newStarId={newStarId} clusterPositions={clusterPositions} skeletons={skeletons}
          />
        </div>
      ) : (
        <AppChrome theme={theme} currentView={currentView} onNavigate={handleNavigate} showFeedbackTab={showFeedbackTab} onToggleFeedbackTab={toggleFeedbackTab}>
          {currentView !== "sky" && <BroadcastBanner theme={theme} />}
          {currentView === "sky" && (
            <div style={{ height: "100%", position: "relative" }}>
              {!timelineMode && (
                <div style={{
                  position: "absolute", top: 8, right: 12,
                  display: "flex", gap: 6, zIndex: 10,
                }}>
                  <button
                    data-hospitality="immersive"
                    onClick={() => setImmersive(true)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      color: theme.textSecondary, fontSize: 13, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    title="Just the sky"
                  >
                    ✦
                  </button>
                  <button
                    data-hospitality="timeline"
                    onClick={() => setTimelineMode(true)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      color: theme.textSecondary, fontSize: 14, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    title="Sky Timeline"
                  >
                    ⏳
                  </button>
                </div>
              )}
              <NightSky
                items={filteredItems} theme={theme}
                onItemClick={(item) => setSelectedItem(item)}
                onAddNew={() => setShowAddItem(true)}
                onGoHome={() => handleNavigate("home")}
                rememberThis={rememberThis} filters={filters} setFilters={setFilters}
                immersive={false} onToggleImmersive={setImmersive}
                timelineMode={timelineMode} setTimelineMode={setTimelineMode}
                newStarId={newStarId} clusterPositions={clusterPositions} skeletons={skeletons}
              />
            </div>
          )}
          {currentView === "list" && (
            <BucketListView items={items} theme={theme} onItemClick={(item) => setSelectedItem(item)} currentUser={currentUser} />
          )}
          {currentView === "feed" && <ActivityFeed activities={activities} theme={theme} />}
          {currentView === "jar" && (
            <TheHearth
              messages={messages} theme={theme} currentUser={currentUser}
              onSend={sendMessage} kairosMembership={kairosMembership}
            />
          )}
          {currentView === "home" && <OurHome theme={theme} currentUser={currentUser} />}
          {currentView === "gems" && <HiddenGems theme={theme} currentUser={currentUser} triggers={triggers} onPlant={plantTrigger} />}
          {currentView === "settings" && (
            <SettingsView
              theme={theme} currentUser={currentUser}
              constellationMode={prefs.constellationMode}
              onSetConstellationMode={setConstellationMode}
            />
          )}
        </AppChrome>
      )}

      {showAddItem && <AddItemModal theme={theme} currentUser={currentUser} onSave={handleAddItem} onClose={() => setShowAddItem(false)} />}
      {selectedItem && (
        <ItemDetail item={selectedItem} theme={theme} currentUser={currentUser}
          onUpdate={handleUpdateItem} onClose={() => setSelectedItem(null)}
          onDelete={(id) => { deleteItem(id); setSelectedItem(null); }} />
      )}
      {newConstellation && (
        <ConstellationCelebration
          constellation={newConstellation}
          theme={theme}
          mode={prefs.constellationMode}
        />
      )}
      {showStaceyIntro && (
        <StaceyIntro onComplete={() => {
          setShowStaceyIntro(false);
          try { localStorage.setItem("starbound_stacey_intro_seen", "true"); } catch {}
        }} />
      )}
      <FeedbackButton
        appId="starbound"
        appName="Starbound"
        endpoint={WORKBENCH_ENDPOINT}
        user={user ? { email: user.email, displayName: user.displayName } : null}
        getIdToken={() => user?.getIdToken()}
        accent={theme.primary}
        surface="rgba(12, 12, 46, 0.95)"
        textColor={theme.textPrimary}
        hideTrigger
      />
    </HospitalityProvider>
  );
}
