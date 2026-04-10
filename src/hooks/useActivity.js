import { useMemo } from "react";

// Derives activity feed from items data.
// In future phases, this could also pull from a Firestore activity collection.

export function useActivity(items) {
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

  return activities;
}
