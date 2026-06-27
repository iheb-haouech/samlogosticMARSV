package com.samlogistic.app.data.local

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "samlogistic_prefs")

class TokenManager(private val context: Context) {
    private val ACCESS_TOKEN_KEY = stringPreferencesKey("access_token")
    private val REFRESH_TOKEN_KEY = stringPreferencesKey("refresh_token")
    private val USER_ROLE_KEY = stringPreferencesKey("user_role")

    val accessToken: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[ACCESS_TOKEN_KEY]
    }

    val refreshToken: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[REFRESH_TOKEN_KEY]
    }

    val userRole: Flow<Int?> = context.dataStore.data.map { prefs ->
        prefs[USER_ROLE_KEY]?.toIntOrNull()
    }

    suspend fun saveTokens(accessToken: String, refreshToken: String, roleId: Int) {
        context.dataStore.edit { prefs ->
            prefs[ACCESS_TOKEN_KEY] = accessToken
            prefs[REFRESH_TOKEN_KEY] = refreshToken
            prefs[USER_ROLE_KEY] = roleId.toString()
        }
    }

    suspend fun saveRole(roleId: Int) {
        context.dataStore.edit { prefs ->
            prefs[USER_ROLE_KEY] = roleId.toString()
        }
    }

    suspend fun clearTokens() {
        context.dataStore.edit { prefs ->
            prefs.remove(ACCESS_TOKEN_KEY)
            prefs.remove(REFRESH_TOKEN_KEY)
            prefs.remove(USER_ROLE_KEY)
        }
    }
}
