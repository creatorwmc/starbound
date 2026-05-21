package com.starbound.wear.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.*
import kotlinx.coroutines.launch

import com.starbound.wear.data.*
import com.starbound.wear.presentation.theme.*

private val stageOrder = listOf("dream", "planning", "doing", "done")

private val stageColors = mapOf(
    "dream" to StageDream,
    "planning" to StagePlanning,
    "doing" to StageDoing,
    "done" to StageDone,
    "released" to StageReleased
)

@Composable
fun ItemDetailScreen(
    itemId: String,
    currentUser: String
) {
    val repository = remember { FirestoreRepository() }
    val scope = rememberCoroutineScope()
    var items by remember { mutableStateOf<List<BucketItem>>(emptyList()) }
    var updating by remember { mutableStateOf(false) }

    DisposableEffect(Unit) {
        val listener = repository.subscribeToItems { newItems -> items = newItems }
        onDispose { listener.remove() }
    }

    val item = items.find { it.id == itemId }
    val userColor = if (currentUser == "zach") ZachPrimary else StaceyPrimary

    Scaffold(timeText = { TimeText() }) {
        if (item == null) {
            Box(
                modifier = Modifier.fillMaxSize().background(NightSky),
                contentAlignment = Alignment.Center
            ) {
                Text("Loading...", color = TextMuted)
            }
            return@Scaffold
        }

        val currentStageIndex = stageOrder.indexOf(item.stage)
        val canAdvance = currentStageIndex in 0 until stageOrder.size - 1
        val nextStage = if (canAdvance) stageOrder[currentStageIndex + 1] else null
        val stageColor = stageColors[item.stage] ?: TextMuted
        val catIcon = CATEGORY_ICONS[item.category] ?: "\u2726"

        ScalingLazyColumn(
            modifier = Modifier.fillMaxSize().background(NightSky),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Category icon + title
            item {
                Text(catIcon, style = MaterialTheme.typography.display3)
            }

            item {
                Text(
                    item.title,
                    style = MaterialTheme.typography.body1.copy(fontSize = 16.sp),
                    color = TextPrimary,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 8.dp)
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Current stage badge
            item {
                val stageIcon = STAGE_ICONS[item.stage] ?: "\u2727"
                CompactChip(
                    onClick = {},
                    label = {
                        Text(
                            "$stageIcon ${STAGE_LABELS[item.stage] ?: item.stage}",
                            color = stageColor
                        )
                    },
                    colors = ChipDefaults.chipColors(backgroundColor = stageColor.copy(alpha = 0.2f))
                )
            }

            // Tier + owner
            item {
                val tierLabel = TIER_LABELS[item.tier] ?: ""
                val ownerLabel = when (item.owner) {
                    "zach" -> "Zach's"
                    "stacey" -> "Stacey's"
                    else -> "Shared"
                }
                Text(
                    "$tierLabel \u2022 $ownerLabel",
                    style = MaterialTheme.typography.caption2,
                    color = TextMuted
                )
            }

            item { Spacer(modifier = Modifier.height(8.dp)) }

            // Advance stage button
            if (nextStage != null) {
                item {
                    val nextColor = stageColors[nextStage] ?: AccentGreen
                    val nextLabel = STAGE_LABELS[nextStage] ?: nextStage
                    Chip(
                        onClick = {
                            if (!updating) {
                                updating = true
                                scope.launch {
                                    try {
                                        repository.updateItemStage(itemId, nextStage, currentUser)
                                    } catch (_: Exception) {}
                                    updating = false
                                }
                            }
                        },
                        label = {
                            Text(
                                if (updating) "Updating..." else "Move to $nextLabel",
                                textAlign = TextAlign.Center,
                                modifier = Modifier.fillMaxWidth()
                            )
                        },
                        colors = ChipDefaults.chipColors(backgroundColor = nextColor.copy(alpha = 0.3f)),
                        modifier = Modifier.fillMaxWidth(0.9f),
                        enabled = !updating
                    )
                }
            }

            // Done celebration
            if (item.stage == "done") {
                item {
                    Text(
                        "\u2728 Completed! \u2728",
                        style = MaterialTheme.typography.body1,
                        color = StarGold,
                        textAlign = TextAlign.Center
                    )
                }
                if (item.completedBy != null) {
                    item {
                        Text(
                            "by ${item.completedBy}",
                            style = MaterialTheme.typography.caption2,
                            color = TextMuted
                        )
                    }
                }
            }

            // Recent notes
            if (item.notes.isNotEmpty()) {
                item { Spacer(modifier = Modifier.height(8.dp)) }
                item {
                    Text(
                        "Notes",
                        style = MaterialTheme.typography.caption1,
                        color = TextSecondary
                    )
                }
                item.notes.takeLast(3).reversed().forEach { note ->
                    item {
                        Card(
                            onClick = {},
                            backgroundPainter = CardDefaults.cardBackgroundPainter(
                                startBackgroundColor = Surface,
                                endBackgroundColor = Surface
                            ),
                            modifier = Modifier.fillMaxWidth(0.9f)
                        ) {
                            Column {
                                Text(
                                    note.text,
                                    style = MaterialTheme.typography.body2,
                                    color = TextPrimary,
                                    fontSize = 12.sp
                                )
                                Text(
                                    "- ${note.by}",
                                    style = MaterialTheme.typography.caption2,
                                    color = TextMuted
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
