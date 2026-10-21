# Decoresworld — Android App

A native Android application shell for the Decoresworld handcrafted wooden decor catalogue (304 products), with Home / Shop All / WhatsApp navigation. Premium cream/deep-green look is retained.

**Website used:** https://gokul010395.github.io/Decoresworld/

**WhatsApp order number:** +91 79043 78890

**Payments:** No PayPal checkout. Customer enquiries via WhatsApp only; order price and export shipping confirmed by seller.

## Open in Android Studio

1. Install current Android Studio with Android SDK Platform 35 and JDK 17.
2. Choose **Open** and select this project folder.
3. Let Gradle sync (Android Gradle Plugin 8.7.3, Gradle 8.9).
4. Run on an Android phone, or select **Build > Build APK(s)**.
5. For a Play Store listing, create a separately signed **release AAB**, set up a Google Play Console account, privacy policy and testing, and ensure Play policies are met. The debug APK is for testing only.

## GitHub Actions build

The `build-android.yml` workflow is included in the repo at `.github/workflows/`. It builds an installable **debug APK**, uploads it as a GitHub Actions artifact, and (when permissions allow) copies it to `android-app/downloads/Decoresworld-debug.apk` in the repository.

**Never publish production signing keys to GitHub.** A CI-generated debug APK is not a production release and its signing key is not persistent across builds. Uninstall older debug builds before installing a new CI-built one if signatures differ.

## Security

- No third-party analytics SDK, ads, user tracking, PayPal or account-password storage.
- The native WebView loads only Decoresworld pages from the configured trusted HTTPS host and path; WhatsApp/Etsy links open externally.
- No camera, contacts, location, storage, SMS, or microphone permissions.
- Orders are WhatsApp messages, not checkout transactions. Internet is required for content and images.
- Links to website content and order details are controlled by the website owner.

## Changing the URL later

When you obtain a brand-only address such as a custom domain, update `SITE`, `SITE_HOST`, and `SITE_PATH` in `MainActivity.java`, then rebuild. Do not use partial host-name matching.
