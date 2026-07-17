package com.samlogistic.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import androidx.compose.runtime.*
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.Alignment
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import com.google.gson.annotations.SerializedName

// --- API Service ---
data class LoginRequest(val email: String, val password: String)
data class LoginResponse(
    @SerializedName("token") val token: String?,
    @SerializedName("user") val user: User?
)
data class User(
    @SerializedName("id") val id: String?,
    @SerializedName("name") val name: String?,
    @SerializedName("role") val role: String?
)

interface ApiService {
    @POST("login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
    
    @GET("transporter/orders")
    suspend fun getTransporterOrders(@Header("Authorization") token: String): List<Order>
    
    @GET("client/orders")
    suspend fun getClientOrders(@Header("Authorization") token: String): List<Order>
}

class ApiClient {
    companion object {
        private const val BASE_URL = "https://api.samlogistic.tn/"
        
        val instance: ApiService by lazy {
            Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(ApiService::class.java)
        }
    }
}

// --- Login Activity ---
class LoginActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    LoginScreen()
                }
            }
        }
    }
}

@Composable
fun LoginScreen() {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("SAM LOGISTIC", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(24.dp))
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Mot de passe") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(16.dp))
        Button(
            onClick = { /* TODO: API call */ },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Se connecter")
        }
    }
}