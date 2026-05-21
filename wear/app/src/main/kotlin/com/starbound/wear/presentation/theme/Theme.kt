package com.starbound.wear.presentation.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.wear.compose.material.Colors
import androidx.wear.compose.material.MaterialTheme

// Starbound night sky palette
val NightSky = Color(0xFF0c0c2e)
val DeepSpace = Color(0xFF1a1045)
val Surface = Color(0xFF1e1e4a)
val SurfaceLight = Color(0xFF2a2a5a)

// Zach's palette
val ZachPrimary = Color(0xFF6C5CE7)
val ZachSecondary = Color(0xFFA29BFE)

// Stacey's palette
val StaceyPrimary = Color(0xFFE17055)
val StaceySecondary = Color(0xFFFAB1A0)

// Shared
val StarGold = Color(0xFFFFEAA7)
val AccentGreen = Color(0xFF55E6C1)
val AccentBlue = Color(0xFF74B9FF)
val AccentRed = Color(0xFFFF7675)
val AccentPurple = Color(0xFFD980FA)
val AccentPink = Color(0xFFFD79A8)
val AccentOrange = Color(0xFFE17055)
val AccentYellow = Color(0xFFFDCB6E)

val TextPrimary = Color(0xFFF0EDFF)
val TextSecondary = Color(0xFFB8B0D9)
val TextMuted = Color(0xFF8880a8)

// Category colors
val CategoryTravel = Color(0xFF74B9FF)
val CategorySkills = Color(0xFFA29BFE)
val CategoryFood = Color(0xFFFDCB6E)
val CategoryExperiences = Color(0xFFFF7675)
val CategoryHome = Color(0xFF55E6C1)
val CategoryCreative = Color(0xFFE17055)
val CategoryRelationships = Color(0xFFD980FA)
val CategoryWildcard = Color(0xFFFD79A8)

// Stage colors
val StageDream = Color(0xFF74B9FF)
val StagePlanning = Color(0xFFFFEAA7)
val StageDoing = Color(0xFF55E6C1)
val StageDone = Color(0xFFFF7675)
val StageReleased = Color(0xFF636E72)

private val StarboundColors = Colors(
    primary = ZachPrimary,
    primaryVariant = ZachSecondary,
    secondary = StarGold,
    secondaryVariant = StarGold,
    background = NightSky,
    surface = Surface,
    error = Color(0xFFef4444),
    onPrimary = TextPrimary,
    onSecondary = NightSky,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    onError = NightSky
)

@Composable
fun StarboundWearTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colors = StarboundColors,
        content = content
    )
}
