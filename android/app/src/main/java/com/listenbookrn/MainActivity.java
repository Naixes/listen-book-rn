package com.listenbookrn;

import com.facebook.react.ReactActivity;
// react-native-gesture-handler需要添加以下代码
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
// react-native-screens需要添加以下代码
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "listenBookRN";
  }
  // react-native-gesture-handler需要添加以下代码
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
      return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
  // react-native-screens需要添加以下代码
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(null);
  }
}
