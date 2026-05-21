package com.starbound.wear.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.*

import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.FirebaseFirestore
import com.kairos.wear.common.data.observeListAs
import com.kairos.wear.common.data.rememberFirestoreList
import com.kairos.wear.common.ui.WearScreen
import com.starbound.wear.data.*
import com.starbound.wear.presentation.theme.*

private val stageColors = mapOf(
    "dream" to StageDream,
    "planning" to StagePlanning,
    "doing" to StageDoing,
    "done" to StageDone,
    "released" to StageReleased
)

private val categoryColors = mapOf(
    "travel" to CategoryTravel,
    "skills" to CategorySkills,
    "food" to CategoryFood,
    "experiences" to CategoryExperiences,
    "home" to CategoryHome,
    "creative" to CategoryCreative,
    "relationships" to CategoryRelationships,
    "wildcard" to CategoryWildcard
)

@Suppress("UNCHECKED_CAST")
private fun parseBucketDoc(doc: DocumentSnapshot): BucketItem? {
    val data = doc.data ?: return null
    val notesList = (data["notes"] as? List<Map<String, Any>>)?.map { n ->
        ItemNote(
            text = n["text"] as? String ?: "",
            by = n["by"] as? String ?: "",
            at = n["at"] as? String ?: "",
            stage = n["stage"] as? String ?: ""
        )
    } ?: emptyList()
    return BucketItem(
        id = doc.id,
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

@Composable
fun BucketListScreen(
    onItemClick: (String) -> Unit
) {
    val items by rememberFirestoreList(key = Unit) {
        FirebaseFirestore.getInstance()
            .collection("items")
            .observeListAs(::parseBucketDoc)
    }

    var filterStage by remember { mutableStateOf<String?>(null) }

    val sortedItems = items.sortedBy { it.createdAt }
    val filteredItems = if (filterStage != null) {
        sortedItems.filter { it.stage == filterStage }
    } else {
        sortedItems.filter { it.stage != "done" && it.stage != "released" }
    }

    WearScreen(modifier = Modifier.background(NightSky)) {
        item {
            Text(
                "Bucket List",
                style = MaterialTheme.typography.title3,
                color = StarGold,
                textAlign = TextAlign.Center
            )
        }

        // Stage filter chips
        item {
            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                val stages = listOf(null to "Active", "doing" to "Doing", "done" to "Done")
                stages.forEach { (stage, label) ->
                    val selected = filterStage == stage
                    CompactChip(
                        onClick = { filterStage = stage },
                        label = { Text(label, fontSize = 10.sp) },
                        colors = ChipDefaults.chipColors(
                            backgroundColor = if (selected) ZachPrimary.copy(alpha = 0.4f)
                            else Surface
                        )
                    )
                }
            }
        }

        item { Spacer(modifier = Modifier.height(4.dp)) }

        if (filteredItems.isEmpty()) {
            item {
                Text(
                    "No items here yet",
                    style = MaterialTheme.typography.body1,
                    color = TextMuted,
                    textAlign = TextAlign.Center
                )
            }
        }

        filteredItems.forEach { item ->
            item {
                val stageColor = stageColors[item.stage] ?: TextMuted
                val catColor = categoryColors[item.category] ?: TextMuted
                val catIcon = CATEGORY_ICONS[item.category] ?: "✦"
                val stageIcon = STAGE_ICONS[item.stage] ?: "✧"

                Chip(
                    onClick = { onItemClick(item.id) },
                    label = {
                        Text(
                            item.title,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                            fontSize = 13.sp
                        )
                    },
                    secondaryLabel = {
                        Text(
                            "$stageIcon ${STAGE_LABELS[item.stage] ?: item.stage}",
                            color = stageColor,
                            fontSize = 11.sp
                        )
                    },
                    icon = {
                        Text(catIcon, fontSize = 16.sp)
                    },
                    colors = ChipDefaults.chipColors(backgroundColor = catColor.copy(alpha = 0.15f)),
                    modifier = Modifier.fillMaxWidth(0.95f)
                )
            }

            item { Spacer(modifier = Modifier.height(2.dp)) }
        }
    }
}
