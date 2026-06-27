package com.samlogistic.app.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.samlogistic.app.data.ServiceLocator
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AuthViewModel : ViewModel() {
    private val authRepository = ServiceLocator.authRepository

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val _loginSuccess = MutableStateFlow(false)
    val loginSuccess: StateFlow<Boolean> = _loginSuccess.asStateFlow()

    private val _registerSuccess = MutableStateFlow(false)
    val registerSuccess: StateFlow<Boolean> = _registerSuccess.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            val result = authRepository.login(email, password)
            _isLoading.value = false
            if (result.isSuccess) {
                _loginSuccess.value = true
            } else {
                _errorMessage.value = result.exceptionOrNull()?.message ?: "Erreur de connexion"
            }
        }
    }

    fun register(email: String, password: String, firstName: String?) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            val result = authRepository.register(email, password, firstName)
            _isLoading.value = false
            if (result.isSuccess) {
                _registerSuccess.value = true
            } else {
                _errorMessage.value = result.exceptionOrNull()?.message ?: "Erreur d'inscription"
            }
        }
    }

    fun clearError() {
        _errorMessage.value = null
    }

    fun setError(message: String) {
        _errorMessage.value = message
    }
}
