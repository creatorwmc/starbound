package com.starbound.wear.data

data class BucketItem(
    val id: String = "",
    val title: String = "",
    val category: String = "",
    val tier: Int = 1,
    val stage: String = "dream",
    val owner: String = "shared",
    val createdBy: String = "",
    val createdAt: String = "",
    val completedAt: String? = null,
    val completedBy: String? = null,
    val activityCount: Int = 0,
    val notes: List<ItemNote> = emptyList()
)

data class ItemNote(
    val text: String = "",
    val by: String = "",
    val at: String = "",
    val stage: String = ""
)

data class ChatMessage(
    val id: String = "",
    val text: String = "",
    val author: String = "",
    val createdAt: String = ""
)

data class Constellation(
    val id: String = "",
    val category: String = "",
    val threshold: Int = 0,
    val number: Int = 0,
    val formedAt: String = ""
)

// Category metadata
data class CategoryInfo(
    val id: String,
    val label: String,
    val icon: String,
    val colorHex: Long
)

val CATEGORIES = listOf(
    CategoryInfo("travel", "Travel & Adventure", "plane", 0xFF74B9FF),
    CategoryInfo("skills", "Skills & Learning", "book", 0xFFA29BFE),
    CategoryInfo("food", "Food & Cooking", "cook", 0xFFFDCB6E),
    CategoryInfo("experiences", "Experiences & Events", "tent", 0xFFFF7675),
    CategoryInfo("home", "Home & Farm", "home", 0xFF55E6C1),
    CategoryInfo("creative", "Creative Projects", "art", 0xFFE17055),
    CategoryInfo("relationships", "Relationships & People", "heart", 0xFFD980FA),
    CategoryInfo("wildcard", "Wild Cards", "joker", 0xFFFD79A8)
)

val CATEGORY_ICONS = mapOf(
    "travel" to "\u2708\uFE0F",
    "skills" to "\uD83D\uDCDA",
    "food" to "\uD83C\uDF73",
    "experiences" to "\uD83C\uDFAA",
    "home" to "\uD83C\uDFE1",
    "creative" to "\uD83C\uDFA8",
    "relationships" to "\uD83D\uDC9C",
    "wildcard" to "\uD83C\uDCCF"
)

val STAGE_ICONS = mapOf(
    "dream" to "\u2727",
    "planning" to "\u2606",
    "doing" to "\u2605",
    "done" to "\u2726",
    "released" to "\u2601"
)

val STAGE_LABELS = mapOf(
    "dream" to "Dream",
    "planning" to "Planning",
    "doing" to "Doing",
    "done" to "Done",
    "released" to "Released"
)

val TIER_LABELS = mapOf(
    1 to "Afternoon Adventure",
    2 to "Big Dream",
    3 to "Once in a Lifetime"
)
