package com.samlogistic.app.ui.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.samlogistic.app.data.ServiceLocator
import com.samlogistic.app.data.remote.dto.CreateOrderRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class CreateOrderViewModel : ViewModel() {
    private val apiService = ServiceLocator.apiService

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    private val _success = MutableStateFlow(false)
    val success: StateFlow<Boolean> = _success.asStateFlow()

    fun createOrder(request: CreateOrderRequest) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val response = apiService.createOrder(request)
                if (response.isSuccessful) {
                    _success.value = true
                } else {
                    _error.value = "Erreur lors de la création"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erreur réseau"
            } finally {
                _isLoading.value = false
            }
        }
    }
}
