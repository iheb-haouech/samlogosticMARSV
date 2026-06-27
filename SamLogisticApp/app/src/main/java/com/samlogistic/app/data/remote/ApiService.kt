package com.samlogistic.app.data.remote

import com.samlogistic.app.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // Auth
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("auth/refresh-token")
    suspend fun refreshToken(@Body request: RefreshRequest): Response<AuthResponse>

    @GET("auth/me")
    suspend fun getMe(): Response<UserResponse>

    // Orders
    @GET("orders/all-orders")
    suspend fun getOrders(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("trackingId") trackingId: String? = null,
        @Query("status") status: String? = null
    ): Response<PaginatedOrdersResponse>

    @GET("orders/order-details/{id}")
    suspend fun getOrderDetails(@Path("id") id: Int): Response<OrderResponse>

    @PATCH("orders/update-order/{id}")
    suspend fun updateOrder(@Path("id") id: Int, @Body request: UpdateOrderRequest): Response<OrderResponse>

    @PATCH("orders/update-order-status/{id}")
    suspend fun updateOrderStatus(
        @Path("id") id: Int,
        @Body request: UpdateOrderStatusRequest
    ): Response<OrderResponse>

    @DELETE("orders/delete-order/{id}")
    suspend fun deleteOrder(@Path("id") id: Int): Response<MessageResponse>

    @POST("orders/create-order")
    suspend fun createOrder(@Body request: CreateOrderRequest): Response<OrderResponse>

    // Order Statuses
    @GET("order-statuses-list")
    suspend fun getOrderStatuses(): Response<OrderStatusesResponse>

    // Statistics
    @GET("statistics")
    suspend fun getStatistics(): Response<StatisticsResponse>

    // Users / Profile
    @GET("user")
    suspend fun getCurrentUser(): Response<UserResponse>

    @PATCH("user/{id}")
    suspend fun updateUser(@Path("id") id: Int, @Body request: UpdateUserRequest): Response<UserResponse>

    // Transporters
    @GET("transporters")
    suspend fun getTransporters(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 50
    ): Response<PaginatedTransportersResponse>

    // Upload
    @Multipart
    @POST("upload")
    suspend fun uploadImage(
        @Part image: okhttp3.MultipartBody.Part
    ): Response<UploadResponse>
}

data class UpdateOrderStatusRequest(
    val orderStatusId: Int
)

data class OrderStatusesResponse(
    val order_statuses: List<OrderStatusResponse>
)

data class UpdateUserRequest(
    val firstName: String? = null,
    val lastName: String? = null,
    val phone: String? = null
)

data class PaginatedTransportersResponse(
    val transporters: List<TransporterResponse>,
    val totalCount: Int
)

data class UploadResponse(
    val url: String?
)
