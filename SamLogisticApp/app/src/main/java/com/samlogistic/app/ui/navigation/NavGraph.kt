package com.samlogistic.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Person
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.samlogistic.app.ui.auth.LoginScreen
import com.samlogistic.app.ui.auth.RegisterScreen
import com.samlogistic.app.ui.home.HomeScreen
import com.samlogistic.app.ui.orders.CreateOrderScreen
import com.samlogistic.app.ui.orders.OrderDetailScreen
import com.samlogistic.app.ui.orders.OrdersScreen
import com.samlogistic.app.ui.profile.ProfileScreen
import com.samlogistic.app.ui.tracking.TrackingScreen

sealed class Screen(val route: String, val title: String) {
    object Login : Screen("login", "Connexion")
    object Register : Screen("register", "Inscription")
    object Orders : Screen("orders", "Commandes")
    object OrderDetail : Screen("order_detail/{orderId}", "Détails")
    object Tracking : Screen("tracking", "Suivi")
    object Profile : Screen("profile", "Profil")
    object CreateOrder : Screen("create_order", "Nouvelle commande")
}

@Composable
fun AppNavigation(navController: NavHostController = androidx.navigation.compose.rememberNavController()) {
    NavHost(navController = navController, startDestination = Screen.Login.route) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Orders.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onNavigateToRegister = { navController.navigate(Screen.Register.route) }
            )
        }
        composable(Screen.Register.route) {
            RegisterScreen(
                onRegisterSuccess = {
                    navController.navigate(Screen.Orders.route) {
                        popUpTo(Screen.Register.route) { inclusive = true }
                    }
                },
                onNavigateToLogin = { navController.popBackStack() }
            )
        }
        composable(Screen.Orders.route) {
            OrdersScreen(
                onOrderClick = { orderId ->
                    navController.navigate("order_detail/$orderId")
                },
                onNavigateToProfile = { navController.navigate(Screen.Profile.route) },
                onNavigateToTracking = { navController.navigate(Screen.Tracking.route) },
                onNavigateToCreateOrder = { navController.navigate(Screen.CreateOrder.route) }
            )
        }
        composable(Screen.OrderDetail.route) { backStackEntry ->
            val orderId = backStackEntry.arguments?.getString("orderId")?.toIntOrNull() ?: 0
            OrderDetailScreen(
                orderId = orderId,
                onBack = { navController.popBackStack() },
                onNavigateToTracking = { id ->
                    navController.navigate("tracking/$id?sourceLat=36.8065&sourceLng=10.1815&recipientLat=36.8065&recipientLng=10.1815")
                }
            )
        }
        composable(Screen.Tracking.route) {
            TrackingScreen(
                orderId = 0,
                sourceLat = 36.8065,
                sourceLng = 10.1815,
                recipientLat = 36.8065,
                recipientLng = 10.1815,
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.Profile.route) {
            ProfileScreen(
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.CreateOrder.route) {
            CreateOrderScreen(
                onOrderCreated = {
                    navController.popBackStack()
                },
                onBack = { navController.popBackStack() }
            )
        }
    }
}
