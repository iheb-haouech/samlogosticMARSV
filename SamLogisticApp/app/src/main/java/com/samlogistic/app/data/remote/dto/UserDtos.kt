package com.samlogistic.app.data.remote.dto

data class TransporterResponse(
    val id: Int,
    val firstName: String?,
    val lastName: String?,
    val email: String?,
    val phone: String?,
    val roleId: Int?,
    val companyId: Int?,
    val disponibility: Boolean?
)

data class TransporterOrdersRequest(
    val page: Int = 1,
    val limit: Int = 100
)

data class StatisticsResponse(
    val totalOrders: Int?,
    val totalRevenue: Double?,
    val pendingOrders: Int?,
    val deliveredOrders: Int?
)
