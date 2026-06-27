package com.samlogistic.app.ui.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.samlogistic.app.data.ServiceLocator
import com.samlogistic.app.data.remote.dto.UserResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch

class ProfileViewModel : ViewModel() {
    private val apiService = ServiceLocator.apiService
    private val tokenManager = ServiceLocator.tokenManager

    private val _user = MutableStateFlow<UserResponse?>(null)
    val user: StateFlow<UserResponse?> = _user.asStateFlow()

    private val _userRole = MutableStateFlow(3)
    val userRole: StateFlow<Int> = _userRole.asStateFlow()

    fun loadUser() {
        viewModelScope.launch {
            try {
                val response = apiService.getMe()
                if (response.isSuccessful) {
                    _user.value = response.body()
                }
                _userRole.value = tokenManager.userRole.firstOrNull() ?: 3
            } catch (e: Exception) {
                // Ignore
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            tokenManager.clearTokens()
        }
    }
}
