package com.samlogistic.app.ui.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
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
import com.samlogistic.app.data.ServiceLocator

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToOrders: () -> Unit,
    onNavigateToTracking: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToCreateOrder: () -> Unit,
    viewModel: HomeViewModel = viewModel()
) {
    val stats by viewModel.stats.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadStats()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("SAM Logistic") }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
            }

            error?.let {
                Text(
                    text = it,
                    color = MaterialTheme.colorScheme.error,
                    modifier = Modifier.padding(8.dp)
                )
                Button(onClick = { viewModel.loadStats() }) {
                    Text("Réessayer")
                }
            }

            stats?.let { s ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    onClick = onNavigateToOrders
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(
                            text = "Total Commandes",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Text(
                            text = "${s.totalOrders ?: 0}",
                            style = MaterialTheme.typography.headlineLarge,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Card(
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToOrders
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "En attente",
                                style = MaterialTheme.typography.bodyMedium
                            )
                            Text(
                                text = "${s.pendingOrders ?: 0}",
                                style = MaterialTheme.typography.titleLarge
                            )
                        }
                    }
                    Card(
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToTracking
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "Livrées",
                                style = MaterialTheme.typography.bodyMedium
                            )
                            Text(
                                text = "${s.deliveredOrders ?: 0}",
                                style = MaterialTheme.typography.titleLarge
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Button(
                onClick = onNavigateToCreateOrder,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.Add, contentDescription = null)
                Spacer(modifier = Modifier.padding(horizontal = 8.dp))
                Text("Nouvelle commande")
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = onNavigateToOrders,
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Inventory2, contentDescription = null)
                    Spacer(modifier = Modifier.padding(horizontal = 8.dp))
                    Text("Commandes")
                }
                Button(
                    onClick = onNavigateToTracking,
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Map, contentDescription = null)
                    Spacer(modifier = Modifier.padding(horizontal = 8.dp))
                    Text("Suivi")
                }
            }

            Button(
                onClick = onNavigateToProfile,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.Person, contentDescription = null)
                Spacer(modifier = Modifier.padding(horizontal = 8.dp))
                Text("Profil")
            }
        }
    }
}
