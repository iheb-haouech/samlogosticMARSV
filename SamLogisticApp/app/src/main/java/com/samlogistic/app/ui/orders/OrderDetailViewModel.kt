package com.samlogistic.app.ui.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.samlogistic.app.data.ServiceLocator
import com.samlogistic.app.data.remote.dto.OrderResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class OrderDetailViewModel : ViewModel() {
    private val apiService = ServiceLocator.apiService

    private val _order = MutableStateFlow<OrderResponse?>(null)
    val order: StateFlow<OrderResponse?> = _order.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    fun loadOrder(orderId: Int) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val response = apiService.getOrderDetails(orderId)
                if (response.isSuccessful) {
                    _order.value = response.body()
                } else {
                    _error.value = "Erreur lors du chargement"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erreur réseau"
            } finally {
                _isLoading.value = false
            }
        }
    }
}
