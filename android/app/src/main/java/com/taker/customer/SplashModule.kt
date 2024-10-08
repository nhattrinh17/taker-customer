package com.taker.customer

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SplashModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SplashScreen"
    }

    @ReactMethod
    fun show() {
        getCurrentActivity()?.let { SplashScreen.show(it) }
    }

    @ReactMethod
    fun hide() {
        SplashScreen.hide()
    }
}





