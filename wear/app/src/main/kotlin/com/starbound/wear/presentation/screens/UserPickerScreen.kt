package com.starbound.wear.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.wear.compose.material.*

import com.starbound.wear.presentation.theme.*

@Composable
fun UserPickerScreen(onSelectUser: (String) -> Unit) {
    Scaffold(timeText = { TimeText() }) {
        ScalingLazyColumn(
            modifier = Modifier.fillMaxSize().background(NightSky),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            item {
                Text(
                    "\u2726",
                    style = MaterialTheme.typography.display3,
                    color = StarGold
                )
            }

            item {
                Text(
                    "Starbound",
                    style = MaterialTheme.typography.title2,
                    color = ZachPrimary,
                    textAlign = TextAlign.Center
                )
            }

            item {
                Text(
                    "Who's dreaming?",
                    style = MaterialTheme.typography.caption1,
                    color = TextSecondary
                )
            }

            item { Spacer(modifier = Modifier.height(8.dp)) }

            item {
                Chip(
                    onClick = { onSelectUser("zach") },
                    label = { Text("Zach") },
                    icon = { Text("Z", color = ZachSecondary) },
                    colors = ChipDefaults.chipColors(backgroundColor = ZachPrimary.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth(0.9f)
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            item {
                Chip(
                    onClick = { onSelectUser("stacey") },
                    label = { Text("Stacey") },
                    icon = { Text("S", color = StaceySecondary) },
                    colors = ChipDefaults.chipColors(backgroundColor = StaceyPrimary.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth(0.9f)
                )
            }
        }
    }
}
