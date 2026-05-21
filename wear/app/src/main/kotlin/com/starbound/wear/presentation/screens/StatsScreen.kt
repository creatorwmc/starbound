package com.starbound.wear.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.*

import com.starbound.wear.data.*
import com.starbound.wear.presentation.theme.*

@Composable
fun StatsScreen() {
    val repository = remember { FirestoreRepository() }
    var items by remember { mutableStateOf<List<BucketItem>>(emptyList()) }
    var constellations by remember { mutableStateOf<List<Constellation>>(emptyList()) }

    DisposableEffect(Unit) {
        val itemListener = repository.subscribeToItems { newItems -> items = newItems }
        val constListener = repository.subscribeToConstellations { c -> constellations = c }
        onDispose {
            itemListener.remove()
            constListener.remove()
        }
    }

    val totalStars = items.size
    val dreamCount = items.count { it.stage == "dream" }
    val planningCount = items.count { it.stage == "planning" }
    val doingCount = items.count { it.stage == "doing" }
    val doneCount = items.count { it.stage == "done" }

    val zachItems = items.count { it.createdBy == "zach" }
    val staceyItems = items.count { it.createdBy == "stacey" }

    val categoryBreakdown = CATEGORIES.map { cat ->
        cat to items.count { it.category == cat.id }
    }.filter { it.second > 0 }.sortedByDescending { it.second }

    Scaffold(timeText = { TimeText() }) {
        ScalingLazyColumn(
            modifier = Modifier.fillMaxSize().background(NightSky),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Text(
                    "\u2726 Sky Stats",
                    style = MaterialTheme.typography.title3,
                    color = StarGold,
                    textAlign = TextAlign.Center
                )
            }

            item { Spacer(modifier = Modifier.height(6.dp)) }

            // Overview
            item {
                Card(
                    onClick = {},
                    backgroundPainter = CardDefaults.cardBackgroundPainter(
                        startBackgroundColor = Surface,
                        endBackgroundColor = Surface
                    ),
                    modifier = Modifier.fillMaxWidth(0.95f)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            "$totalStars",
                            style = MaterialTheme.typography.display3,
                            color = StarGold
                        )
                        Text("Total Stars", style = MaterialTheme.typography.caption2, color = TextMuted)
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Stage breakdown
            item {
                Card(
                    onClick = {},
                    backgroundPainter = CardDefaults.cardBackgroundPainter(
                        startBackgroundColor = Surface,
                        endBackgroundColor = Surface
                    ),
                    modifier = Modifier.fillMaxWidth(0.95f)
                ) {
                    Column {
                        Text("By Stage", style = MaterialTheme.typography.caption1, color = TextSecondary)
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("$dreamCount", color = StageDream, fontSize = 16.sp)
                                Text("\u2727", color = StageDream, fontSize = 10.sp)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("$planningCount", color = StagePlanning, fontSize = 16.sp)
                                Text("\u2606", color = StagePlanning, fontSize = 10.sp)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("$doingCount", color = StageDoing, fontSize = 16.sp)
                                Text("\u2605", color = StageDoing, fontSize = 10.sp)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("$doneCount", color = StageDone, fontSize = 16.sp)
                                Text("\u2726", color = StageDone, fontSize = 10.sp)
                            }
                        }
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Constellations
            item {
                Card(
                    onClick = {},
                    backgroundPainter = CardDefaults.cardBackgroundPainter(
                        startBackgroundColor = Surface,
                        endBackgroundColor = Surface
                    ),
                    modifier = Modifier.fillMaxWidth(0.95f)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            "${constellations.size}",
                            style = MaterialTheme.typography.title1,
                            color = AccentPurple
                        )
                        Text("Constellations", style = MaterialTheme.typography.caption2, color = TextMuted)
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Contributors
            item {
                Card(
                    onClick = {},
                    backgroundPainter = CardDefaults.cardBackgroundPainter(
                        startBackgroundColor = Surface,
                        endBackgroundColor = Surface
                    ),
                    modifier = Modifier.fillMaxWidth(0.95f)
                ) {
                    Column {
                        Text("Dreamers", style = MaterialTheme.typography.caption1, color = TextSecondary)
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("$zachItems", color = ZachSecondary, fontSize = 16.sp)
                                Text("Zach", style = MaterialTheme.typography.caption2, color = ZachSecondary)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("$staceyItems", color = StaceySecondary, fontSize = 16.sp)
                                Text("Stacey", style = MaterialTheme.typography.caption2, color = StaceySecondary)
                            }
                        }
                    }
                }
            }

            // Top categories
            if (categoryBreakdown.isNotEmpty()) {
                item { Spacer(modifier = Modifier.height(4.dp)) }
                item {
                    Text("Top Categories", style = MaterialTheme.typography.caption1, color = TextSecondary)
                }
                categoryBreakdown.take(5).forEach { (cat, count) ->
                    item {
                        val catIcon = CATEGORY_ICONS[cat.id] ?: "\u2726"
                        CompactChip(
                            onClick = {},
                            label = {
                                Text(
                                    "$catIcon ${cat.label}: $count",
                                    fontSize = 11.sp,
                                    color = TextPrimary
                                )
                            },
                            colors = ChipDefaults.chipColors(
                                backgroundColor = androidx.compose.ui.graphics.Color(cat.colorHex).copy(alpha = 0.2f)
                            )
                        )
                    }
                }
            }
        }
    }
}
