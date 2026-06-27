package com.samlogistic.app.ui.tracking

import android.Manifest
import android.content.Context
import android.location.LocationManager
import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.compose.ui.viewinterop.AndroidView

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TrackingScreen(
    orderId: Int,
    sourceLat: Double?,
    sourceLng: Double?,
    recipientLat: Double?,
    recipientLng: Double?,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    var currentLocation by remember { mutableStateOf<GeoPoint?>(null) }

    LaunchedEffect(Unit) {
        Configuration.getInstance().load(context, context.getSharedPreferences("osm", Context.MODE_PRIVATE))
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Suivi commande #$orderId") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Retour")
                    }
                }
            )
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding)) {
            Box(modifier = Modifier.weight(1f)) {
                OsmMapView(
                    sourceLat = sourceLat,
                    sourceLng = sourceLng,
                    recipientLat = recipientLat,
                    recipientLng = recipientLng,
                    currentLocation = currentLocation
                )
            }
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = {
                        val lm = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
                        val provider = lm.getBestProvider(android.location.Criteria(), true)
                        if (provider != null && ActivityCompat.checkSelfPermission(
                                context, Manifest.permission.ACCESS_FINE_LOCATION
                            ) == android.content.pm.PackageManager.PERMISSION_GRANTED
                        ) {
                            val loc = lm.getLastKnownLocation(provider)
                            loc?.let {
                                currentLocation = GeoPoint(it.latitude, it.longitude)
                            }
                        } else {
                            Toast.makeText(context, "Permission localisation requise", Toast.LENGTH_SHORT).show()
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.MyLocation, contentDescription = null)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Ma position")
                }
            }
        }
    }
}

@Composable
fun OsmMapView(
    sourceLat: Double?,
    sourceLng: Double?,
    recipientLat: Double?,
    recipientLng: Double?,
    currentLocation: GeoPoint?
) {
    val context = LocalContext.current
    val mapView = remember {
        MapView(context).apply {
            setTileSource(TileSourceFactory.MAPNIK)
            setMultiTouchControls(true)
            controller.setZoom(12.0)
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            mapView.onDetach()
        }
    }

    AndroidView(
        factory = {
            mapView.apply {
                val startPoint = if (sourceLat != null && sourceLng != null) {
                    GeoPoint(sourceLat, sourceLng)
                } else if (recipientLat != null && recipientLng != null) {
                    GeoPoint(recipientLat, recipientLng)
                } else {
                    GeoPoint(36.8065, 10.1815)
                }
                controller.setCenter(startPoint)

                if (sourceLat != null && sourceLng != null) {
                    val sourceMarker = Marker(mapView).apply {
                        position = GeoPoint(sourceLat, sourceLng)
                        setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
                        title = "Source"
                    }
                    overlays.add(sourceMarker)
                }

                if (recipientLat != null && recipientLng != null) {
                    val recipientMarker = Marker(mapView).apply {
                        position = GeoPoint(recipientLat, recipientLng)
                        setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
                        title = "Destinataire"
                    }
                    overlays.add(recipientMarker)
                }

                currentLocation?.let { loc ->
                    val myMarker = Marker(mapView).apply {
                        position = loc
                        setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
                        title = "Ma position"
                    }
                    overlays.add(myMarker)
                }
            }
        },
        modifier = Modifier.fillMaxSize()
    )
}
