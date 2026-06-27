import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
HOST='212.227.76.200'; USER='root'; PASS='we62pLUjAYqb5'
ssh=paramiko.SSHClient(); ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()); ssh.connect(HOST,username=USER,password=PASS,timeout=30)

api_service = '''package com.samlogistic.app.data.remote

import com.samlogistic.app.data.remote.dto.*
import okhttp3.MultipartBody
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("auth/refresh-token")
    suspend fun refreshToken(@Body request: RefreshRequest): Response<AuthResponse>

    @GET("auth/me")
    suspend fun getMe(): Response<UserResponse>

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

    @GET("order-statuses-list")
    suspend fun getOrderStatuses(): Response<OrderStatusesResponse>

    @GET("statistics")
    suspend fun getStatistics(): Response<StatisticsResponse>

    @GET("user")
    suspend fun getCurrentUser(): Response<UserResponse>

    @PATCH("user/{id}")
    suspend fun updateUser(@Path("id") id: Int, @Body request: UpdateUserRequest): Response<UserResponse>

    @GET("transporters")
    suspend fun getTransporters(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 50
    ): Response<PaginatedTransportersResponse>

    @POST("transporters/transporter-orders/{id}")
    suspend fun getTransporterOrders(
        @Path("id") transporterId: Int,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 12
    ): Response<PaginatedOrdersResponse>

    @POST("transporters/transporter-accepted-orders/{id}")
    suspend fun getTransporterAcceptedOrders(
        @Path("id") transporterId: Int,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 10
    ): Response<PaginatedOrdersResponse>

    @GET("transporters/transporter-delivered-orders/{id}")
    suspend fun getTransporterDeliveredOrders(
        @Path("id") transporterId: Int,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 10
    ): Response<PaginatedOrdersResponse>

    @Multipart
    @POST("upload")
    suspend fun uploadImage(
        @Part image: MultipartBody.Part
    ): Response<UploadResponse>
}

data class UpdateOrderStatusRequest(val orderStatusId: Int)
data class OrderStatusesResponse(val order_statuses: List<OrderStatusResponse>)
data class UpdateUserRequest(
    val firstName: String? = null,
    val lastName: String? = null,
    val phone: String? = null
)
data class PaginatedTransportersResponse(
    val transporters: List<TransporterResponse>,
    val totalCount: Int
)
data class UploadResponse(val url: String?)
'''

with ssh.open_sftp() as sftp:
    with sftp.open('/opt/SamLogisticApp/app/src/main/java/com/samlogistic/app/data/remote/ApiService.kt', 'w') as f:
        f.write(api_service)

print('Updated ApiService.kt with transporter endpoints')

# Build + sign + deploy
cmds = [
    'find /opt -name "app-release-unsigned.apk" -delete',
    'bash -lc "export ANDROID_HOME=/opt/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:/opt/gradle/gradle-8.6/bin:$PATH && cd /opt/SamLogisticApp && /opt/gradle/gradle-8.6/bin/gradle --no-daemon clean :app:assembleRelease 2>&1 | tail -30"',
    '/opt/android-sdk/build-tools/34.0.0/apksigner sign --ks /opt/release.keystore --ks-key-alias samlogistic --ks-pass pass:samlogistic2024 --key-pass pass:samlogistic2024 --out /opt/SamLogisticApp-signed.apk /opt/SamLogisticApp/app/build/outputs/apk/release/app-release-unsigned.apk',
    'cp /opt/SamLogisticApp-signed.apk /var/www/samlogistic/app/SamLogisticApp.apk',
    'docker cp /var/www/samlogistic/app/SamLogisticApp.apk sam-frontend:/usr/share/nginx/html/SamLogisticApp.apk',
    'curl -sk -o /tmp/role_apk.apk -w "HTTP:%{http_code} SIZE:%{size_download}" https://samlogistic.tn/SamLogisticApp.apk',
]
for c in cmds:
    print(f'\n>>> {c[:60]}...')
    i,o,e = ssh.exec_command(c, timeout=120 if 'gradle' in c else 30)
    o=o.read().decode('utf-8',errors='replace').strip(); e=e.read().decode('utf-8',errors='replace').strip()
    if o: print(o[-4000:])
    if e: print('ERR:',e[-1000:])

ssh.close()
