package com.samlogistic.app.ui.orders

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
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
import com.samlogistic.app.data.remote.dto.CreateOrderRequest

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateOrderScreen(
    onOrderCreated: () -> Unit,
    onBack: () -> Unit,
    viewModel: CreateOrderViewModel = viewModel()
) {
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    val success by viewModel.success.collectAsState()

    LaunchedEffect(success) {
        if (success) {
            onOrderCreated()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Nouvelle commande") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Retour"
                        )
                    }
                }
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
            Text(
                text = "Créer une nouvelle commande",
                style = MaterialTheme.typography.headlineSmall
            )

            Text(
                text = "Cette fonctionnalité sera disponible prochainement. Utilisez la plateforme web pour créer des commandes pour le moment.",
                style = MaterialTheme.typography.bodyMedium
            )

            Button(
                onClick = { onBack() },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Retour")
            }
        }
    }
}
