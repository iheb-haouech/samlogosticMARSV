package com.samlogistic.app.data

import android.app.Application
import com.samlogistic.app.data.local.TokenManager
import com.samlogistic.app.data.remote.ApiService
import com.samlogistic.app.data.remote.AuthInterceptor
import com.samlogistic.app.data.remote.SyncAuthInterceptor
import com.samlogistic.app.data.repository.AuthRepository
import com.jakewharton.threetenabp.AndroidThreeTen
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ServiceLocator {
    lateinit var apiService: ApiService
        private set
    lateinit var authRepository: AuthRepository
        private set
    lateinit var tokenManager: TokenManager
        private set

    fun init(application: Application) {
        tokenManager = TokenManager(application)
        AndroidThreeTen.init(application)

        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(SyncAuthInterceptor())
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl("https://api.samlogistic.tn/")
            .addConverterFactory(GsonConverterFactory.create())
            .client(okHttpClient)
            .build()

        apiService = retrofit.create(ApiService::class.java)
        authRepository = AuthRepository(apiService, tokenManager)
    }
}
