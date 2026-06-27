package com.samlogistic.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector

sealed class BottomNavItem(val route: String, val icon: ImageVector, val label: String) {
    object Orders : BottomNavItem("orders", Icons.Default.Inventory2, "Commandes")
    object Tracking : BottomNavItem("tracking", Icons.Default.Map, "Suivi")
    object Profile : BottomNavItem("profile", Icons.Default.Person, "Profil")
}

@Composable
fun BottomNav(
    currentRoute: String,
    onNavigateToOrders: () -> Unit,
    onNavigateToTracking: () -> Unit,
    onNavigateToProfile: () -> Unit
) {
    val items = listOf(
        BottomNavItem.Orders,
        BottomNavItem.Tracking,
        BottomNavItem.Profile
    )

    NavigationBar {
        items.forEach { screen ->
            val selected = currentRoute == screen.route
            NavigationBarItem(
                selected = selected,
                onClick = {
                    when (screen.route) {
                        "orders" -> onNavigateToOrders()
                        "tracking" -> onNavigateToTracking()
                        "profile" -> onNavigateToProfile()
                    }
                },
                icon = { Icon(screen.icon, contentDescription = screen.label) },
                label = { Text(screen.label) }
            )
        }
    }
}
