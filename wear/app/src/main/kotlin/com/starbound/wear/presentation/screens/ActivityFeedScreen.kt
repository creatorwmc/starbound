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

import com.starbound.wear.data.*
import com.starbound.wear.presentation.theme.*

data class ActivityEntry(
    val text: String,
    val by: String,
    val timestamp: String,
    val type: String // "created", "stage", "note", "completed"
)

@Composable
fun ActivityFeedScreen() {
    val repository = remember { FirestoreRepository() }
    var items by remember { mutableStateOf<List<BucketItem>>(emptyList()) }

    DisposableEffect(Unit) {
        val listener = repository.subscribeToItems { newItems -> items = newItems }
        onDispose { listener.remove() }
    }

    // Derive activity from items
    val activities = remember(items) {
        val entries = mutableListOf<ActivityEntry>()

        items.forEach { item ->
            // Creation
            if (item.createdAt.isNotEmpty()) {
                entries.add(ActivityEntry(
                    text = "Created \"${item.title}\"",
                    by = item.createdBy,
                    timestamp = item.createdAt,
                    type = "created"
                ))
            }

            // Completion
            if (item.completedAt != null && item.completedBy != null) {
                entries.add(ActivityEntry(
                    text = "Completed \"${item.title}\"",
                    by = item.completedBy!!,
                    timestamp = item.completedAt!!,
                    type = "completed"
                ))
            }

            // Notes
            item.notes.forEach { note ->
                entries.add(ActivityEntry(
                    text = "Note on \"${item.title}\": ${note.text}",
                    by = note.by,
                    timestamp = note.at,
                    type = "note"
                ))
            }
        }

        entries.sortedByDescending { it.timestamp }.take(20)
    }

    Scaffold(timeText = { TimeText() }) {
        ScalingLazyColumn(
            modifier = Modifier.fillMaxSize().background(NightSky),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Text(
                    "\uD83D\uDCCA Activity",
                    style = MaterialTheme.typography.title3,
                    color = StarGold,
                    textAlign = TextAlign.Center
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            if (activities.isEmpty()) {
                item {
                    Text(
                        "No activity yet",
                        style = MaterialTheme.typography.body2,
                        color = TextMuted
                    )
                }
            }

            activities.forEach { activity ->
                item {
                    val icon = when (activity.type) {
                        "created" -> "\u2726"
                        "completed" -> "\u2728"
                        "note" -> "\uD83D\uDCDD"
                        else -> "\u2022"
                    }
                    val authorColor = if (activity.by == "zach") ZachSecondary else StaceySecondary

                    Card(
                        onClick = {},
                        backgroundPainter = CardDefaults.cardBackgroundPainter(
                            startBackgroundColor = Surface,
                            endBackgroundColor = Surface
                        ),
                        modifier = Modifier.fillMaxWidth(0.95f)
                    ) {
                        Column {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text(icon, fontSize = 12.sp)
                                Text(
                                    activity.by.replaceFirstChar { it.uppercase() },
                                    style = MaterialTheme.typography.caption2,
                                    color = authorColor
                                )
                            }
                            Text(
                                activity.text,
                                style = MaterialTheme.typography.body2,
                                color = TextPrimary,
                                fontSize = 12.sp,
                                maxLines = 2,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                }
                item { Spacer(modifier = Modifier.height(2.dp)) }
            }
        }
    }
}
