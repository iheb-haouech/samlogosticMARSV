package com.samlogistic.app

import android.app.Application
import com.samlogistic.app.data.ServiceLocator

class SamLogisticApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        ServiceLocator.init(this)
    }
}
