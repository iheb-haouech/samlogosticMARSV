package com.samlogistic.app.ui.orders

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.samlogistic.app.ui.components.BottomNav
import com.samlogistic.app.ui.navigation.Screen
import com.samlogistic.app.data.remote.dto.OrderResponse

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrdersScreen(
    onOrderClick: (Int) -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToTracking: () -> Unit,
    onNavigateToCreateOrder: () -> Unit,
    viewModel: OrdersViewModel = viewModel()
) {
    val orders by viewModel.orders.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    LaunchedEffect(Unit) { viewModel.loadOrders() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Commandes") },
                actions = {
                    IconButton(onClick = { viewModel.loadOrders() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Actualiser")
                    }
                }
            )
        },
        bottomBar = {
            BottomNav(
                currentRoute = Screen.Orders.route,
                onNavigateToOrders = {},
                onNavigateToTracking = onNavigateToTracking,
                onNavigateToProfile = onNavigateToProfile
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onNavigateToCreateOrder) {
                Icon(Icons.Default.Add, contentDescription = "Nouvelle commande")
            }
        }
    ) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding)) {
            if (error != null) {
                Text(text = error!!, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(16.dp))
                Button(onClick = { viewModel.loadOrders() }, modifier = Modifier.padding(horizontal = 16.dp)) {
                    Text("Réessayer")
                }
            }
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
            }
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(orders) { order ->
                    OrderCard(order = order, onClick = { onOrderClick(order.id) })
                }
                if (orders.isEmpty() && !isLoading && error == null) {
                    item {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(text = "Aucune commande", style = MaterialTheme.typography.bodyLarge)
                            androidx.compose.foundation.layout.Spacer(modifier = Modifier.padding(8.dp))
                            Button(onClick = onNavigateToCreateOrder) { Text("Créer une commande") }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun OrderCard(order: OrderResponse, onClick: () -> Unit) {
    Card(onClick = onClick, modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "Commande #${order.id}", style = MaterialTheme.typography.titleMedium)
                Text(
                    text = order.totalPrice?.let { "$it DT" } ?: "---",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            androidx.compose.foundation.layout.Spacer(modifier = Modifier.padding(vertical = 4.dp))
            Text(text = "ID: ${order.trackingId ?: "N/A"}", style = MaterialTheme.typography.bodySmall)
            order.recipient?.let { recipient ->
                Text(text = recipient.fullName ?: "Destinataire inconnu", style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}
