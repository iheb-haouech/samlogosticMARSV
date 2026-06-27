package com.samlogistic.app.ui.orders

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
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
import com.samlogistic.app.data.remote.dto.OrderResponse

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderDetailScreen(
    orderId: Int,
    onBack: () -> Unit,
    onNavigateToTracking: (Int) -> Unit,
    viewModel: OrderDetailViewModel = viewModel()
) {
    val order by viewModel.order.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    LaunchedEffect(orderId) {
        viewModel.loadOrder(orderId)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Commande #${order?.id ?: orderId}") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Retour")
                    }
                }
            )
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }

            error?.let {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(text = it, color = MaterialTheme.colorScheme.error)
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(onClick = { viewModel.loadOrder(orderId) }) {
                        Text("Réessayer")
                    }
                }
            }

            order?.let { ord ->
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    DetailRow("ID suivi", ord.trackingId ?: "N/A")
                    DetailRow("Prix total", ord.totalPrice?.let { "$it DT" } ?: "N/A")
                    DetailRow("Prix client", ord.clientPrice?.let { "$it DT" } ?: "N/A")
                    DetailRow("Prix transporteur", ord.transporterPrice?.let { "$it DT" } ?: "N/A")
                    DetailRow("Poids", ord.totalWeight?.let { "$it kg" } ?: "N/A")
                    DetailRow("Quantité", ord.totalQuantity?.toString() ?: "N/A")

                    ord.source?.let { source ->
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Source", style = MaterialTheme.typography.titleMedium)
                        DetailRow("Adresse", source.address ?: "N/A")
                        DetailRow("Ville", source.city ?: "N/A")
                        DetailRow("Pays", source.country ?: "N/A")
                    }

                    ord.recipient?.let { recipient ->
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Destinataire", style = MaterialTheme.typography.titleMedium)
                        DetailRow("Nom", recipient.fullName ?: "N/A")
                        DetailRow("Téléphone", recipient.phone ?: "N/A")
                        DetailRow("Adresse", recipient.address ?: "N/A")
                        DetailRow("Ville", recipient.city ?: "N/A")
                    }

                    if (!ord.packages.isNullOrEmpty()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Colis (${ord.packages.size})", style = MaterialTheme.typography.titleMedium)
                        ord.packages.forEach { pkg ->
                            Card(modifier = Modifier.fillMaxWidth()) {
                                Column(modifier = Modifier.padding(8.dp)) {
                                    Text("Desc: ${pkg.description ?: "N/A"}")
                                    Text("Poids: ${pkg.weight ?: 0} kg")
                                    Text("Qté: ${pkg.quantity ?: 0}")
                                    pkg.qrCode?.let { qr ->
                                        Text("QR: $qr")
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = { onNavigateToTracking(ord.id) },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Suivi")
                        }
                        if (ord.source != null && ord.recipient != null) {
                            Button(
                                onClick = { onNavigateToTracking(ord.id) },
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Carte")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DetailRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, style = MaterialTheme.typography.bodyMedium)
        Text(text = value, style = MaterialTheme.typography.bodyMedium)
    }
}
