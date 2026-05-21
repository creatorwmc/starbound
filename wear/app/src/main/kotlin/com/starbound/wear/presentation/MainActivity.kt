package com.starbound.wear.presentation

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.wear.compose.navigation.SwipeDismissableNavHost
import androidx.wear.compose.navigation.composable
import androidx.wear.compose.navigation.rememberSwipeDismissableNavController
import com.starbound.wear.presentation.screens.*
import com.starbound.wear.presentation.theme.StarboundWearTheme

private const val PREFS_NAME = "starbound_wear"
private const val KEY_USER = "current_user"

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            StarboundWearApp(this)
        }
    }
}

@Composable
fun StarboundWearApp(context: Context) {
    StarboundWearTheme {
        val prefs = remember { context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE) }
        var currentUser by remember {
            mutableStateOf(prefs.getString(KEY_USER, null))
        }

        // User picker gate
        if (currentUser == null) {
            UserPickerScreen(onSelectUser = { user ->
                prefs.edit().putString(KEY_USER, user).apply()
                currentUser = user
            })
            return@StarboundWearTheme
        }

        val user = currentUser!!
        val navController = rememberSwipeDismissableNavController()

        SwipeDismissableNavHost(
            navController = navController,
            startDestination = "home"
        ) {
            // Home
            composable("home") {
                HomeScreen(
                    currentUser = user,
                    onBucketListClick = { navController.navigate("bucket_list") },
                    onHearthClick = { navController.navigate("hearth") },
                    onActivityClick = { navController.navigate("activity") },
                    onQuickAddClick = { navController.navigate("quick_add") },
                    onStatsClick = { navController.navigate("stats") }
                )
            }

            // Bucket List
            composable("bucket_list") {
                BucketListScreen(
                    onItemClick = { itemId ->
                        navController.navigate("item_detail/$itemId")
                    }
                )
            }

            // Item Detail
            composable("item_detail/{itemId}") { backStackEntry ->
                val itemId = backStackEntry.arguments?.getString("itemId") ?: ""
                ItemDetailScreen(
                    itemId = itemId,
                    currentUser = user
                )
            }

            // The Hearth
            composable("hearth") {
                HearthScreen(currentUser = user)
            }

            // Activity Feed
            composable("activity") {
                ActivityFeedScreen()
            }

            // Quick Add
            composable("quick_add") {
                QuickAddScreen(
                    currentUser = user,
                    onDone = { navController.popBackStack() }
                )
            }

            // Stats
            composable("stats") {
                StatsScreen()
            }
        }
    }
}
