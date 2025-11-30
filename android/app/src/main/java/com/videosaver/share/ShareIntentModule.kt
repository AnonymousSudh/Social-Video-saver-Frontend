package com.videosaver.share

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ShareIntentModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ShareIntentModule"

    @ReactMethod
    fun getSharedText(promise: Promise) {
        try {
            val text = ShareIntentHelper.sharedText
            promise.resolve(text)
            // Clear after read so it won’t be reused accidentally
            ShareIntentHelper.sharedText = null
        } catch (e: Exception) {
            promise.reject("E_SHARE_INTENT", "Failed to get shared text", e)
        }
    }
}
