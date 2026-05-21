package com.starbound.wear.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.wear.compose.material.*

import com.starbound.wear.data.BucketItem
import com.starbound.wear.data.FirestoreRepository
import com.starbound.wear.presentation.theme.*

@Composable
fun HomeScreen(
    currentUser: String,
    onBucketListClick: () -> Unit,
    onHearthClick: () -> Unit,
    onActivityClick: () -> Unit,
    onQuickAddClick: () -> Unit,
    onStatsClick: () -> Unit
) {
    val repository = remember { FirestoreRepository() }
    var items by remember { mutableStateOf<List<BucketItem>>(emptyList()) }

    DisposableEffect(Unit) {
        val listener = repository.subscribeToItems { newItems -> items = newItems }
        onDispose { listener.remove() }
    }

    val totalStars = items.size
    val doneCount = items.count { it.stage == "done" }
    val doingCount = items.count { it.stage == "doing" }
    val userColor = if (currentUser == "zach") ZachPrimary else StaceyPrimary

    Scaffold(timeText = { TimeText() }) {
        ScalingLazyColumn(
            modifier = Modifier.fillMaxSize().background(NightSky),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Title
            item {
                Text(
                    "Starbound",
                    style = MaterialTheme.typography.title2,
                    color = userColor,
                    textAlign = TextAlign.Center
                )
            }

            // Stats summary
            item {
                Text(
                    "$totalStars stars \u2022 $doneCount done \u2022 $doingCount active",
                    style = MaterialTheme.typography.caption2,
                    color = TextSecondary
                )
            }

            item { Spacer(modifier = Modifier.height(8.dp)) }

            // Bucket List
            item {
                Chip(
                    onClick = onBucketListClick,
                    label = { Text("Bucket List") },
                    icon = { Text("\u2726", style = MaterialTheme.typography.title3) },
                    colors = ChipDefaults.chipColors(backgroundColor = userColor.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth(0.9f)
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Quick Add
            item {
                Chip(
                    onClick = onQuickAddClick,
                    label = { Text("New Dream") },
                    icon = { Text("+", style = MaterialTheme.typography.title3, color = StarGold) },
                    colors = ChipDefaults.chipColors(backgroundColor = userColor.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth(0.9f)
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // The Hearth
            item {
                Chip(
                    onClick = onHearthClick,
                    label = { Text("The Hearth") },
                    icon = { Text("\uD83D\uDD25", style = MaterialTheme.typography.title3) },
                    colors = ChipDefaults.chipColors(backgroundColor = userColor.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth(0.9f)
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Activity Feed
            item {
                Chip(
                    onClick = onActivityClick,
                    label = { Text("Activity") },
                    icon = { Text("\uD83D\uDCCA", style = MaterialTheme.typography.title3) },
                    colors = ChipDefaults.chipColors(backgroundColor = userColor.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth(0.9f)
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Stats
            item {
                CompactChip(
                    onClick = onStatsClick,
                    label = { Text("Stats", color = TextMuted) },
                    colors = ChipDefaults.chipColors(backgroundColor = userColor.copy(alpha = 0.1f))
                )
            }
        }
    }
}
