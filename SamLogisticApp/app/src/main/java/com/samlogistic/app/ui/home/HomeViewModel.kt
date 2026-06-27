package com.samlogistic.app.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.samlogistic.app.data.ServiceLocator
import com.samlogistic.app.data.remote.dto.StatisticsResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class HomeViewModel : ViewModel() {
    private val apiService = ServiceLocator.apiService

    private val _stats = MutableStateFlow<StatisticsResponse?>(null)
    val stats: StateFlow<StatisticsResponse?> = _stats.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    fun loadStats() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val response = apiService.getStatistics()
                if (response.isSuccessful) {
                    _stats.value = response.body()
                } else {
                    _error.value = "Erreur lors du chargement des statistiques"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erreur réseau"
            } finally {
                _isLoading.value = false
            }
        }
    }
}
