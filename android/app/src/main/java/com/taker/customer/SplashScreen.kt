package com.taker.customer

import android.app.Activity
import android.app.Dialog
import android.os.Build
import android.view.WindowManager
import java.lang.ref.WeakReference

object SplashScreen {
    private var mSplashDialog: Dialog? = null
    private var mActivity: WeakReference<Activity>? = null

    fun show(activity: Activity) {
        mActivity = WeakReference(activity)
        activity.runOnUiThread {
            if (!activity.isFinishing) {
                mSplashDialog = Dialog(activity, android.R.style.Theme_DeviceDefault_NoActionBar_Fullscreen)
                mSplashDialog?.setContentView(R.layout.activity_splash_screen)
                mSplashDialog?.setCancelable(false)
                setActivityAndroidP(mSplashDialog)
                mSplashDialog?.takeIf { !it.isShowing }?.show()
            }
        }
    }

    fun hide() {
        mSplashDialog?.takeIf { it.isShowing }?.dismiss()
    }

    private fun setActivityAndroidP(dialog: Dialog?) {
        if (Build.VERSION.SDK_INT >= 28) {
            if (dialog != null && dialog.window != null) {
                dialog.window?.addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
                val lp = dialog.window?.attributes
                lp?.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
                dialog.window?.attributes = lp
            }
        }
    }
}
