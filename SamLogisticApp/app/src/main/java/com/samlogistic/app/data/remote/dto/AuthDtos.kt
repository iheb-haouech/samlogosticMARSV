package com.samlogistic.app.data.remote.dto

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val password: String,
    val firstName: String? = null,
    val lastName: String? = null,
    val phone: String? = null
)

data class AuthResponse(
    @SerializedName("access_token")
    val accessToken: String,
    @SerializedName("refresh_token")
    val refreshToken: String
)

data class RefreshRequest(
    @SerializedName("refresh_token")
    val refreshToken: String
)

data class UserResponse(
    val id: Int,
    val email: String,
    val firstName: String?,
    val lastName: String?,
    val phone: String?,
    val roleId: Int,
    val companyId: Int?,
    val createdAt: String?,
    val updatedAt: String?
)

data class MessageResponse(
    val message: String,
    val error: String? = null,
    val statusCode: Int? = null
)
