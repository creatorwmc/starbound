package com.starbound.wear.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.*
import kotlinx.coroutines.launch

import com.starbound.wear.data.*
import com.starbound.wear.presentation.theme.*

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

@Composable
fun QuickAddScreen(
    currentUser: String,
    onDone: () -> Unit
) {
    val repository = remember { FirestoreRepository() }
    val scope = rememberCoroutineScope()
    var title by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("experiences") }
    var selectedTier by remember { mutableIntStateOf(1) }
    var saving by remember { mutableStateOf(false) }
    var saved by remember { mutableStateOf(false) }

    val userColor = if (currentUser == "zach") ZachPrimary else StaceyPrimary

    fun save() {
        val text = title.trim()
        if (text.isEmpty() || saving) return
        saving = true
        scope.launch {
            try {
                val id = "star-${System.currentTimeMillis()}-${(0..999).random()}"
                repository.addItem(BucketItem(
                    id = id,
                    title = text,
                    category = selectedCategory,
                    tier = selectedTier,
                    stage = "dream",
                    owner = "shared",
                    createdBy = currentUser
                ))
                saved = true
            } catch (_: Exception) {}
            saving = false
        }
    }

    Scaffold(timeText = { TimeText() }) {
        if (saved) {
            Box(
                modifier = Modifier.fillMaxSize().background(NightSky),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("\u2726", style = MaterialTheme.typography.display3, color = StarGold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Star added!", style = MaterialTheme.typography.body1, color = TextPrimary)
                    Spacer(modifier = Modifier.height(12.dp))
                    CompactChip(
                        onClick = {
                            title = ""
                            saved = false
                        },
                        label = { Text("Add another") },
                        colors = ChipDefaults.chipColors(backgroundColor = userColor.copy(alpha = 0.3f))
                    )
                }
            }
            return@Scaffold
        }

        ScalingLazyColumn(
            modifier = Modifier.fillMaxSize().background(NightSky),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Text(
                    "New Dream",
                    style = MaterialTheme.typography.title3,
                    color = StarGold,
                    textAlign = TextAlign.Center
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Title input
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.95f)
                        .background(Surface, shape = MaterialTheme.shapes.small)
                        .padding(horizontal = 12.dp, vertical = 10.dp)
                ) {
                    if (title.isEmpty()) {
                        Text("What's the dream?", color = TextMuted, fontSize = 14.sp)
                    }
                    BasicTextField(
                        value = title,
                        onValueChange = { title = it },
                        textStyle = MaterialTheme.typography.body1.copy(
                            color = TextPrimary,
                            fontSize = 14.sp
                        ),
                        singleLine = false,
                        maxLines = 3,
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                        keyboardActions = KeyboardActions(onDone = { save() }),
                        cursorBrush = SolidColor(StarGold),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            item { Spacer(modifier = Modifier.height(6.dp)) }

            // Category picker (scrollable chips)
            item {
                Text("Category", style = MaterialTheme.typography.caption2, color = TextSecondary)
            }

            CATEGORIES.forEach { cat ->
                item {
                    val selected = selectedCategory == cat.id
                    val catColor = categoryColors[cat.id] ?: TextMuted
                    val catIcon = CATEGORY_ICONS[cat.id] ?: "\u2726"
                    CompactChip(
                        onClick = { selectedCategory = cat.id },
                        label = {
                            Text(
                                "$catIcon ${cat.label}",
                                fontSize = 11.sp,
                                color = if (selected) TextPrimary else TextMuted
                            )
                        },
                        colors = ChipDefaults.chipColors(
                            backgroundColor = if (selected) catColor.copy(alpha = 0.3f) else Surface
                        )
                    )
                }
            }

            item { Spacer(modifier = Modifier.height(6.dp)) }

            // Tier picker
            item {
                Text("Size", style = MaterialTheme.typography.caption2, color = TextSecondary)
            }
            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    listOf(1 to "\u2B50", 2 to "\uD83C\uDF1F", 3 to "\uD83D\uDCAB").forEach { (tier, icon) ->
                        val selected = selectedTier == tier
                        CompactChip(
                            onClick = { selectedTier = tier },
                            label = { Text(icon) },
                            colors = ChipDefaults.chipColors(
                                backgroundColor = if (selected) StarGold.copy(alpha = 0.3f) else Surface
                            )
                        )
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(8.dp)) }

            // Save button
            item {
                Chip(
                    onClick = { save() },
                    label = {
                        Text(
                            if (saving) "Saving..." else "Add to Sky",
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                    },
                    colors = ChipDefaults.chipColors(backgroundColor = userColor),
                    modifier = Modifier.fillMaxWidth(0.9f),
                    enabled = !saving && title.isNotBlank()
                )
            }
        }
    }
}
