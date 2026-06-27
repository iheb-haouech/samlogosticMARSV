package com.samlogistic.app.ui.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.samlogistic.app.data.ServiceLocator
import com.samlogistic.app.data.remote.dto.OrderResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class OrdersViewModel : ViewModel() {
    private val apiService = ServiceLocator.apiService

    private val _orders = MutableStateFlow<List<OrderResponse>>(emptyList())
    val orders: StateFlow<List<OrderResponse>> = _orders.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    fun loadOrders() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val response = apiService.getOrders()
                if (response.isSuccessful) {
                    _orders.value = response.body()?.orders ?: emptyList()
                } else {
                    _error.value = "Erreur lors du chargement des commandes"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erreur réseau"
            } finally {
                _isLoading.value = false
            }
        }
    }
}
