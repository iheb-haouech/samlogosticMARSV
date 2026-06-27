package com.samlogistic.app.data.remote.dto

import com.google.gson.annotations.SerializedName

data class CreateOrderRequest(
    val description: String? = null,
    val totalWeight: Double? = null,
    val totalLength: Double? = null,
    val totalWidth: Double? = null,
    val totalHeight: Double? = null,
    val totalPrice: Double? = null,
    val clientPrice: Double? = null,
    val transporterPrice: Double? = null,
    val totalQuantity: Int? = null,
    val shipmentPrice: Double? = null,
    val refrences: List<String>? = null,
    val mainType: String? = "national",
    val tradeType: String? = null,
    val transportType: String? = null,
    val subType: String? = null,
    val otherMessage: String? = null,
    val source: OrderSourceDTO? = null,
    val recipient: OrderRecipientDTO? = null,
    val packages: List<CreatePackageDTO>? = null,
    val pods: Any? = null
)

data class OrderSourceDTO(
    val companyName: String? = null,
    val phone: String? = null,
    val city: String? = null,
    val country: String? = null,
    val streetAddress: String? = null,
    val secondAddress: String? = null,
    val zipCode: String? = null,
    val email: String? = null
)

data class OrderRecipientDTO(
    val companyName: String? = null,
    val phone: String? = null,
    val city: String? = null,
    val country: String? = null,
    val streetAddress: String? = null,
    val secondAddress: String? = null,
    val zipCode: String? = null,
    val email: String? = null
)

data class CreatePackageDTO(
    val weight: Double,
    val width: Double,
    val length: Double,
    val height: Double,
    val price: Double,
    val quantity: Int,
    val references: List<PackageReferenceDTO>? = null
)

data class PackageReferenceDTO(
    val referenceName: String,
    val quantity: Int
)

data class OrderResponse(
    val id: Int,
    val trackingId: String?,
    val description: String?,
    val totalWeight: Double?,
    val totalLength: Double?,
    val totalWidth: Double?,
    val totalHeight: Double?,
    val totalPrice: Double?,
    val clientPrice: Double?,
    val transporterPrice: Double?,
    val totalQuantity: Int?,
    val shipmentPrice: Double?,
    val refrences: List<String>?,
    val orderStatusId: Int?,
    val deliveredByUserId: Int?,
    val createdAt: String?,
    val updatedAt: String?,
    val source: OrderSourceDTO?,
    val recipient: OrderRecipientDTO?,
    val packages: List<PackageDTO>?,
    val qrCode: String? = null
)

data class PackageDTO(
    val id: Int?,
    val description: String?,
    val weight: Double?,
    val length: Double?,
    val width: Double?,
    val height: Double?,
    val quantity: Int?,
    val qrCode: String? = null
)

data class OrderStatusResponse(
    val id: Int,
    val statusName: String
)

data class PaginatedOrdersResponse(
    val orders: List<OrderResponse>,
    val totalCount: Int
)
