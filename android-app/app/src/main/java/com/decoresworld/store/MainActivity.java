package com.decoresworld.store;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.webkit.SslErrorHandler;
import android.net.http.SslError;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

public final class MainActivity extends Activity {
    // Public website: no customer credentials or PayPal checkout are stored in the app.
    private static final String SITE = "https://decoresworld.netlify.app/";
    private static final String SITE_HOST = "decoresworld.netlify.app";
    private static final String SITE_PATH = "";
    private static final String WHATSAPP = "https://wa.me/917904378890?text=Hello%20Decoresworld%2C%20I%20would%20like%20to%20order%20handcrafted%20wooden%20decor.";
    private static final int GREEN = Color.rgb(23,48,40);
    private static final int GOLD = Color.rgb(186,152,102);
    private static final int CREAM = Color.rgb(250,248,241);
    private WebView browser;
    private View errorView;
    private ProgressBar progress;
    private boolean mainFrameError = false;

    private int dp(float d) {return (int)(d * getResources().getDisplayMetrics().density + 0.5f);}

    private GradientDrawable background(int color, int radiusDp) {
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(color);
        bg.setCornerRadius(dp(radiusDp));
        return bg;
    }

    private TextView text(String value, int size, int color, boolean bold) {
        TextView label = new TextView(this);
        label.setText(value);
        label.setTextSize(size);
        label.setTextColor(color);
        if (bold) label.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        label.setGravity(Gravity.CENTER_VERTICAL);
        return label;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(GREEN);
        getWindow().setNavigationBarColor(GREEN);
        if (Build.VERSION.SDK_INT >= 35) {
            getWindow().getDecorView().setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                return insets;
            });
        }
        createScreen();
        if (savedInstanceState == null || browser.restoreState(savedInstanceState) == null) {
            browser.loadUrl(SITE);
        }
    }

    private void createScreen() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(CREAM);

        LinearLayout toolbar = new LinearLayout(this);
        toolbar.setGravity(Gravity.CENTER_VERTICAL);
        toolbar.setPadding(dp(18), dp(12), dp(18), dp(12));
        toolbar.setBackgroundColor(GREEN);

        TextView monogram = text("DW", 16, GOLD, true);
        monogram.setGravity(Gravity.CENTER);
        monogram.setBackground(background(Color.rgb(31,65,53), 12));
        toolbar.addView(monogram, new LinearLayout.LayoutParams(dp(42), dp(42)));

        LinearLayout brand = new LinearLayout(this);
        brand.setOrientation(LinearLayout.VERTICAL);
        brand.setPadding(dp(12), 0, 0, 0);
        TextView title = text("DECORESWORLD", 16, Color.WHITE, true);
        title.setLetterSpacing(0.10f);
        TextView subtitle = text("HANDCRAFTED HERITAGE", 9, GOLD, false);
        subtitle.setLetterSpacing(0.14f);
        brand.addView(title);
        brand.addView(subtitle);
        toolbar.addView(brand, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        TextView refresh = text("⟳", 30, Color.WHITE, false);
        refresh.setGravity(Gravity.CENTER);
        refresh.setContentDescription("Refresh products");
        refresh.setOnClickListener(v -> loadSite());
        toolbar.addView(refresh, new LinearLayout.LayoutParams(dp(45), dp(45)));
        root.addView(toolbar, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progress.setMax(100);
        progress.setProgressTintList(android.content.res.ColorStateList.valueOf(GOLD));
        progress.setVisibility(View.VISIBLE);
        root.addView(progress, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(3)));

        FrameLayout stage = new FrameLayout(this);
        browser = new WebView(this);
        WebSettings settings = browser.getSettings();
        settings.setJavaScriptEnabled(true); // Required for existing Decoresworld catalogue/cart.
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        if (Build.VERSION.SDK_INT >= 26) settings.setSafeBrowsingEnabled(true);
        browser.setWebViewClient(new StoreWebViewClient());
        browser.setWebChromeClient(new WebChromeClient() {
            @Override public void onProgressChanged(WebView view, int percentage) {
                progress.setProgress(percentage);
                progress.setVisibility(percentage >= 100 ? View.GONE : View.VISIBLE);
            }
        });
        stage.addView(browser, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        LinearLayout offline = new LinearLayout(this);
        offline.setOrientation(LinearLayout.VERTICAL);
        offline.setGravity(Gravity.CENTER);
        offline.setPadding(dp(24), dp(20), dp(24), dp(20));
        offline.setBackgroundColor(CREAM);
        TextView offlineTitle = text("Please check your connection", 23, GREEN, true);
        offlineTitle.setGravity(Gravity.CENTER);
        TextView offlineText = text("Decoresworld products need internet access. Please reconnect and try again.", 15, GREEN, false);
        offlineText.setGravity(Gravity.CENTER);
        offlineText.setPadding(0, dp(12), 0, dp(26));
        Button retry = new Button(this);
        retry.setText("TRY AGAIN");
        retry.setTextColor(Color.WHITE);
        retry.setAllCaps(false);
        retry.setBackground(background(GREEN, 8));
        retry.setOnClickListener(v -> loadSite());
        offline.addView(offlineTitle);
        offline.addView(offlineText);
        offline.addView(retry, new LinearLayout.LayoutParams(dp(210), dp(52)));
        stage.addView(offline, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        offline.setVisibility(View.GONE);
        errorView = offline;
        root.addView(stage, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));

        LinearLayout bottom = new LinearLayout(this);
        bottom.setGravity(Gravity.CENTER);
        bottom.setPadding(dp(10), dp(7), dp(10), dp(8));
        bottom.setBackgroundColor(Color.WHITE);
        addNav(bottom, "⌂  HOME", () -> browser.loadUrl(SITE));
        addNav(bottom, "▦  SHOP ALL", () -> browser.loadUrl(SITE + "#shop"));
        addNav(bottom, "✆  WHATSAPP", () -> openExternal(Uri.parse(WHATSAPP)));
        root.addView(bottom, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(59)));
        setContentView(root);
    }

    private void addNav(LinearLayout nav, String label, Runnable action) {
        TextView item = text(label, 12, GREEN, true);
        item.setGravity(Gravity.CENTER);
        item.setOnClickListener(v -> action.run());
        item.setContentDescription(label.replaceAll("[^a-zA-Z ]", ""));
        nav.addView(item, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1));
    }

    private boolean trusted(Uri uri) {
        String scheme = uri.getScheme();
        String host = uri.getHost();
        String path = uri.getPath();
        return "https".equalsIgnoreCase(scheme)
            && SITE_HOST.equalsIgnoreCase(host)
            && path != null
            && (path.equals(SITE_PATH) || path.startsWith(SITE_PATH + "/"));
    }

    private void openExternal(Uri uri) {
        String scheme = uri.getScheme();
        if (!"https".equalsIgnoreCase(scheme) && !"http".equalsIgnoreCase(scheme) && !"mailto".equalsIgnoreCase(scheme) && !"tel".equalsIgnoreCase(scheme) && !"whatsapp".equalsIgnoreCase(scheme)) return;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE));
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, "No app found to open this link", Toast.LENGTH_LONG).show();
        }
    }

    private void loadSite() {
        mainFrameError = false;
        errorView.setVisibility(View.GONE);
        browser.loadUrl(SITE);
    }

    private class StoreWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (trusted(uri)) return false;
            if (request.isForMainFrame()) openExternal(uri);
            return true;
        }
        @Override
        public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            mainFrameError = false;
            errorView.setVisibility(View.GONE);
        }
        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            if (!mainFrameError) errorView.setVisibility(View.GONE);
        }
        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            if (request.isForMainFrame()) {
                mainFrameError = true;
                errorView.setVisibility(View.VISIBLE);
            }
        }
        @Override
        public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse response) {
            if (request.isForMainFrame() && response.getStatusCode() >= 400) {
                mainFrameError = true;
                errorView.setVisibility(View.VISIBLE);
            }
        }
        @Override
        public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
            handler.cancel(); // Never bypass invalid HTTPS certificates.
            mainFrameError = true;
            errorView.setVisibility(View.VISIBLE);
        }
    }

    @Override public void onBackPressed() {
        if (browser != null && browser.canGoBack()) browser.goBack();
        else super.onBackPressed();
    }
    @Override protected void onSaveInstanceState(Bundle state) {
        if (browser != null) browser.saveState(state);
        super.onSaveInstanceState(state);
    }
    @Override protected void onDestroy() {
        if (browser != null) {
            browser.stopLoading();
            browser.setWebChromeClient(null);
            browser.setWebViewClient(null);
            browser.destroy();
            browser = null;
        }
        super.onDestroy();
    }
}
