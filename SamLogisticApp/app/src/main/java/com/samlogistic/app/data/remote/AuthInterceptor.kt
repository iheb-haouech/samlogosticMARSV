package com.samlogistic.app.data.remote

import android.content.Context
import com.samlogistic.app.data.local.TokenManager
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val path = request.url.encodedPath

        // Public endpoints that don't need auth
        val publicPaths = listOf(
            "/auth/login",
            "/auth/register",
            "/auth/verify-email",
            "/auth/request-reset-password-email",
            "/auth/reset-password",
            "/auth/google",
            "/auth/google/callback"
        )

        if (publicPaths.any { path.startsWith(it) }) {
            return chain.proceed(request)
        }

        // For other requests, we need to run synchronously-ish using a blocking call
        // In production, use a proper coroutine/flow approach. Here we use a simple synchronous token read
        // by storing tokens in a thread-safe way.
        val token = tokenManager.accessToken
        
        // Since we can't suspend in interceptor, we'll use a callback-based approach
        // For simplicity, we'll add the token via a custom header provider pattern
        // We'll need to read token synchronously from a volatile cache
        return chain.proceed(request)
    }
}

// Alternative: Synchronous token cache for interceptor
object TokenCache {
    @Volatile
    var accessToken: String? = null
    @Volatile
    var refreshToken: String? = null
}

class SyncAuthInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val path = request.url.encodedPath

        val publicPaths = listOf(
            "/auth/login",
            "/auth/register",
            "/auth/verify-email",
            "/auth/request-reset-password-email",
            "/auth/reset-password",
            "/auth/google",
            "/auth/google/callback"
        )

        if (publicPaths.any { path.startsWith(it) }) {
            return chain.proceed(request)
        }

        val token = TokenCache.accessToken
        val authenticatedRequest = if (!token.isNullOrEmpty()) {
            request.newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            request
        }

        return chain.proceed(authenticatedRequest)
    }
}
