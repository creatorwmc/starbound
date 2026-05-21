package com.starbound.wear.data

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ListenerRegistration
import com.google.firebase.firestore.Query
import kotlinx.coroutines.tasks.await

class FirestoreRepository {
    private val firestore = FirebaseFirestore.getInstance()

    // ── Bucket List Items ─────────────────────────────────

    fun subscribeToItems(onChange: (List<BucketItem>) -> Unit): ListenerRegistration {
        return firestore.collection("items")
            .addSnapshotListener { snapshot, error ->
                if (error != null || snapshot == null) {
                    onChange(emptyList())
                    return@addSnapshotListener
                }
                val items = snapshot.documents.mapNotNull { doc ->
                    val data = doc.data ?: return@mapNotNull null
                    parseItem(doc.id, data)
                }.sortedBy { it.createdAt }
                onChange(items)
            }
    }

    suspend fun updateItemStage(itemId: String, newStage: String, user: String) {
        val updates = hashMapOf<String, Any>(
            "stage" to newStage
        )
        if (newStage == "done") {
            updates["completedAt"] = java.text.SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US
            ).apply { timeZone = java.util.TimeZone.getTimeZone("UTC") }.format(java.util.Date())
            updates["completedBy"] = user
        }
        firestore.collection("items").document(itemId).update(updates).await()
    }

    suspend fun addItem(item: BucketItem) {
        val data = hashMapOf(
            "title" to item.title,
            "category" to item.category,
            "tier" to item.tier,
            "stage" to item.stage,
            "owner" to item.owner,
            "createdBy" to item.createdBy,
            "createdAt" to java.text.SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US
            ).apply { timeZone = java.util.TimeZone.getTimeZone("UTC") }.format(java.util.Date()),
            "activityCount" to 0,
            "notes" to emptyList<Map<String, String>>()
        )
        firestore.collection("items").document(item.id).set(data).await()
    }

    suspend fun addNoteToItem(itemId: String, noteText: String, user: String, stage: String) {
        val doc = firestore.collection("items").document(itemId).get().await()
        val data = doc.data ?: return
        @Suppress("UNCHECKED_CAST")
        val notes = (data["notes"] as? List<Map<String, Any>>)?.toMutableList() ?: mutableListOf()
        notes.add(mapOf(
            "text" to noteText,
            "by" to user,
            "at" to java.text.SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US
            ).apply { timeZone = java.util.TimeZone.getTimeZone("UTC") }.format(java.util.Date()),
            "stage" to stage
        ))
        val count = (data["activityCount"] as? Long)?.toInt() ?: 0
        firestore.collection("items").document(itemId)
            .update("notes", notes, "activityCount", count + 1).await()
    }

    // ── Chat Messages (The Hearth) ────────────────────────

    fun subscribeToMessages(onChange: (List<ChatMessage>) -> Unit): ListenerRegistration {
        return firestore.collection("chatroom")
            .addSnapshotListener { snapshot, error ->
                if (error != null || snapshot == null) {
                    onChange(emptyList())
                    return@addSnapshotListener
                }
                val messages = snapshot.documents.mapNotNull { doc ->
                    val data = doc.data ?: return@mapNotNull null
                    ChatMessage(
                        id = doc.id,
                        text = data["text"] as? String ?: "",
                        author = data["author"] as? String ?: "",
                        createdAt = data["createdAt"] as? String ?: ""
                    )
                }.sortedBy { it.createdAt }
                onChange(messages)
            }
    }

    suspend fun sendMessage(text: String, author: String) {
        val data = hashMapOf(
            "text" to text,
            "author" to author,
            "createdAt" to java.text.SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US
            ).apply { timeZone = java.util.TimeZone.getTimeZone("UTC") }.format(java.util.Date())
        )
        firestore.collection("chatroom").add(data).await()
    }

    // ── Constellations ────────────────────────────────────

    fun subscribeToConstellations(onChange: (List<Constellation>) -> Unit): ListenerRegistration {
        return firestore.collection("constellations")
            .addSnapshotListener { snapshot, error ->
                if (error != null || snapshot == null) {
                    onChange(emptyList())
                    return@addSnapshotListener
                }
                val constellations = snapshot.documents.mapNotNull { doc ->
                    val data = doc.data ?: return@mapNotNull null
                    Constellation(
                        id = doc.id,
                        category = data["category"] as? String ?: "",
                        threshold = (data["threshold"] as? Long)?.toInt() ?: 0,
                        number = (data["number"] as? Long)?.toInt() ?: 0,
                        formedAt = data["formedAt"] as? String ?: ""
                    )
                }
                onChange(constellations)
            }
    }

    // ── Parsing ───────────────────────────────────────────

    @Suppress("UNCHECKED_CAST")
    private fun parseItem(id: String, data: Map<String, Any>): BucketItem {
        val notesList = (data["notes"] as? List<Map<String, Any>>)?.map { n ->
            ItemNote(
                text = n["text"] as? String ?: "",
                by = n["by"] as? String ?: "",
                at = n["at"] as? String ?: "",
                stage = n["stage"] as? String ?: ""
            )
        } ?: emptyList()

        return BucketItem(
            id = id,
            title = data["title"] as? String ?: "",
            category = data["category"] as? String ?: "",
            tier = (data["tier"] as? Long)?.toInt() ?: 1,
            stage = data["stage"] as? String ?: "dream",
            owner = data["owner"] as? String ?: "shared",
            createdBy = data["createdBy"] as? String ?: "",
            createdAt = data["createdAt"] as? String ?: "",
            completedAt = data["completedAt"] as? String,
            completedBy = data["completedBy"] as? String,
            activityCount = (data["activityCount"] as? Long)?.toInt() ?: 0,
            notes = notesList
        )
    }
}
