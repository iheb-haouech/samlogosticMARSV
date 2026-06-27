package com.samlogistic.app.data.repository

import com.samlogistic.app.data.local.TokenManager
import com.samlogistic.app.data.remote.ApiService
import com.samlogistic.app.data.remote.TokenCache
import com.samlogistic.app.data.remote.dto.*
import kotlinx.coroutines.flow.first

class AuthRepository(
    private val apiService: ApiService,
    private val tokenManager: TokenManager
) {

    suspend fun login(email: String, password: String): Result<AuthResponse> {
        return try {
            val response = apiService.login(LoginRequest(email, password))
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    val meResponse = apiService.getMe()
                    val roleId = if (meResponse.isSuccessful) {
                        meResponse.body()?.roleId ?: 3
                    } else 3
                    tokenManager.saveTokens(body.accessToken, body.refreshToken, roleId)
                    TokenCache.accessToken = body.accessToken
                    TokenCache.refreshToken = body.refreshToken
                    Result.success(body)
                } else {
                    Result.failure(Exception("Empty response"))
                }
            } else {
                Result.failure(Exception(response.errorBody()?.string() ?: "Login failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun register(email: String, password: String, firstName: String? = null): Result<AuthResponse> {
        return try {
            val response = apiService.register(RegisterRequest(email, password, firstName))
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    tokenManager.saveTokens(body.accessToken, body.refreshToken, 3)
                    TokenCache.accessToken = body.accessToken
                    TokenCache.refreshToken = body.refreshToken
                    Result.success(body)
                } else {
                    Result.failure(Exception("Empty response"))
                }
            } else {
                Result.failure(Exception(response.errorBody()?.string() ?: "Register failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout() {
        tokenManager.clearTokens()
        TokenCache.accessToken = null
        TokenCache.refreshToken = null
    }

    suspend fun isLoggedIn(): Boolean {
        return TokenCache.accessToken != null
    }

    suspend fun getUserRole(): Int {
        return tokenManager.userRole.first() ?: 3
    }
}
