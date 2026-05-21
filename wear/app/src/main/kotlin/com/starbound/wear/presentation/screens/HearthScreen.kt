package com.starbound.wear.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.*
import kotlinx.coroutines.launch

import com.starbound.wear.data.ChatMessage
import com.starbound.wear.data.FirestoreRepository
import com.starbound.wear.presentation.theme.*

@Composable
fun HearthScreen(currentUser: String) {
    val repository = remember { FirestoreRepository() }
    val scope = rememberCoroutineScope()
    var messages by remember { mutableStateOf<List<ChatMessage>>(emptyList()) }
    var newMessage by remember { mutableStateOf("") }
    var sending by remember { mutableStateOf(false) }

    DisposableEffect(Unit) {
        val listener = repository.subscribeToMessages { msgs -> messages = msgs }
        onDispose { listener.remove() }
    }

    fun send() {
        val text = newMessage.trim()
        if (text.isEmpty() || sending) return
        sending = true
        newMessage = ""
        scope.launch {
            try {
                repository.sendMessage(text, currentUser)
            } catch (_: Exception) {}
            sending = false
        }
    }

    val userColor = if (currentUser == "zach") ZachPrimary else StaceyPrimary

    Scaffold(timeText = { TimeText() }) {
        ScalingLazyColumn(
            modifier = Modifier.fillMaxSize().background(NightSky),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Text(
                    "\uD83D\uDD25 The Hearth",
                    style = MaterialTheme.typography.title3,
                    color = StarGold,
                    textAlign = TextAlign.Center
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Compose message
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(0.95f),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(Surface, shape = MaterialTheme.shapes.small)
                            .padding(horizontal = 10.dp, vertical = 8.dp)
                    ) {
                        if (newMessage.isEmpty()) {
                            Text("Message...", color = TextMuted, fontSize = 13.sp)
                        }
                        BasicTextField(
                            value = newMessage,
                            onValueChange = { newMessage = it },
                            textStyle = MaterialTheme.typography.body2.copy(
                                color = TextPrimary,
                                fontSize = 13.sp
                            ),
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                            keyboardActions = KeyboardActions(onSend = { send() }),
                            cursorBrush = SolidColor(StarGold),
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    CompactChip(
                        onClick = { send() },
                        label = { Text("\u2191") },
                        colors = ChipDefaults.chipColors(backgroundColor = userColor)
                    )
                }
            }

            item { Spacer(modifier = Modifier.height(6.dp)) }

            // Messages (most recent first)
            val recentMessages = messages.takeLast(20).reversed()

            if (recentMessages.isEmpty()) {
                item {
                    Text(
                        "No messages yet",
                        style = MaterialTheme.typography.body2,
                        color = TextMuted
                    )
                }
            }

            recentMessages.forEach { msg ->
                item {
                    val isMe = msg.author == currentUser
                    val bubbleColor = if (isMe) userColor.copy(alpha = 0.25f) else Surface
                    val authorColor = if (msg.author == "zach") ZachSecondary else StaceySecondary

                    Card(
                        onClick = {},
                        backgroundPainter = CardDefaults.cardBackgroundPainter(
                            startBackgroundColor = bubbleColor,
                            endBackgroundColor = bubbleColor
                        ),
                        modifier = Modifier.fillMaxWidth(0.95f)
                    ) {
                        Column {
                            if (!isMe) {
                                Text(
                                    msg.author.replaceFirstChar { it.uppercase() },
                                    style = MaterialTheme.typography.caption2,
                                    color = authorColor
                                )
                            }
                            Text(
                                msg.text,
                                style = MaterialTheme.typography.body2,
                                color = TextPrimary,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
                item { Spacer(modifier = Modifier.height(2.dp)) }
            }
        }
    }
}
