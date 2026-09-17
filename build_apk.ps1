# Build Android APK for Deep Health AI
param(
    [string]$OutputDir = $PSScriptRoot
)

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Building Deep Health AI Android APK    " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Paths
$sdk = "C:\Users\ajaym\AppData\Local\Android\Sdk"
$bt = "$sdk\build-tools\34.0.0"
$platform = "$sdk\platforms\android-34"
$androidJar = "$platform\android.jar"
$jbr = "C:\Program Files\Android\Android Studio\jbr"
$java = "$jbr\bin\java.exe"
$javac = "$jbr\bin\javac.exe"
$jar = "$jbr\bin\jar.exe"
$keytool = "$jbr\bin\keytool.exe"
$aapt2 = "$bt\aapt2.exe"
$d8 = "$bt\d8.bat"
$zipalign = "$bt\zipalign.exe"
$apksigner = "$bt\apksigner.bat"

# Temporary build dir
$buildDir = "$PSScriptRoot\build_android"
if (Test-Path $buildDir) {
    Remove-Item -Recurse -Force $buildDir
}
New-Item -ItemType Directory -Path $buildDir | Out-Null
New-Item -ItemType Directory -Path "$buildDir\src\io\deephealthindia\app" | Out-Null
New-Item -ItemType Directory -Path "$buildDir\res\values" | Out-Null
New-Item -ItemType Directory -Path "$buildDir\res\drawable" | Out-Null
New-Item -ItemType Directory -Path "$buildDir\res\mipmap-xxhdpi" | Out-Null
New-Item -ItemType Directory -Path "$buildDir\assets" | Out-Null
New-Item -ItemType Directory -Path "$buildDir\obj" | Out-Null
New-Item -ItemType Directory -Path "$buildDir\gen" | Out-Null

# 1. AndroidManifest.xml
$manifestContent = @"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="io.deephealthindia.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar"
        android:hardwareAccelerated="true"
        android:allowBackup="true"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"@

# 2. Strings.xml
$stringsContent = @"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Deep Health AI</string>
</resources>
"@

# 3. MainActivity.java
$javaContent = @"
package io.deephealthindia.app;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView webView;
    private static final int PERMISSION_REQUEST_CODE = 1001;

    static class CustomWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (url.startsWith("file://") || url.contains("deephealthindia.io")) {
                view.loadUrl(url);
                return true;
            }
            return false;
        }
    }

    static class CustomWebChromeClient extends WebChromeClient {
        @Override
        public void onPermissionRequest(PermissionRequest request) {
            request.grant(request.getResources());
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);

        webView.setWebViewClient(new CustomWebViewClient());
        webView.setWebChromeClient(new CustomWebChromeClient());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{
                    Manifest.permission.CAMERA,
                    Manifest.permission.RECORD_AUDIO
                }, PERMISSION_REQUEST_CODE);
            }
        }

        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            boolean cameraGranted = false;
            for (int i = 0; i < permissions.length; i++) {
                if (permissions[i].equals(Manifest.permission.CAMERA) && grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                    cameraGranted = true;
                }
            }
            if (!cameraGranted) {
                Toast.makeText(this, "Camera permission is needed for AI Biometric Facial Scan", Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
"@

# Write source files without UTF-8 BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("$buildDir\AndroidManifest.xml", $manifestContent, $utf8NoBom)
[System.IO.File]::WriteAllText("$buildDir\res\values\strings.xml", $stringsContent, $utf8NoBom)
[System.IO.File]::WriteAllText("$buildDir\src\io\deephealthindia\app\MainActivity.java", $javaContent, $utf8NoBom)

# 4. Copy launcher icon
if (Test-Path "$PSScriptRoot\app-icon.png") {
    Copy-Item "$PSScriptRoot\app-icon.png" "$buildDir\res\mipmap-xxhdpi\ic_launcher.png"
}

# 5. Copy Web App assets
Write-Host "Copying web assets into Android APK package..." -ForegroundColor Yellow
Copy-Item "$PSScriptRoot\index.html" "$buildDir\assets\index.html"
Copy-Item "$PSScriptRoot\app.css" "$buildDir\assets\app.css"
Copy-Item "$PSScriptRoot\app.js" "$buildDir\assets\app.js"
if (Test-Path "$PSScriptRoot\app-icon.png") {
    Copy-Item "$PSScriptRoot\app-icon.png" "$buildDir\assets\app-icon.png"
}

# 6. Compile Resources with AAPT2
Write-Host "Compiling Android resources with aapt2..." -ForegroundColor Yellow
& $aapt2 compile --dir "$buildDir\res" -o "$buildDir\resources.zip"
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile failed" }

# 7. Link Resources and generate R.java & unaligned APK
Write-Host "Linking resources and assets with aapt2..." -ForegroundColor Yellow
& $aapt2 link -I $androidJar `
    --manifest "$buildDir\AndroidManifest.xml" `
    --java "$buildDir\gen" `
    -o "$buildDir\app-unaligned.apk" `
    -A "$buildDir\assets" `
    "$buildDir\resources.zip" --auto-add-overlay
if ($LASTEXITCODE -ne 0) { throw "aapt2 link failed" }

# 8. Compile Java Sources
Write-Host "Compiling Java sources..." -ForegroundColor Yellow
$javaFiles = @(Get-ChildItem -Recurse -Path "$buildDir\src", "$buildDir\gen" -Filter *.java | ForEach-Object { $_.FullName })
& $javac -g --release 8 -cp $androidJar -d "$buildDir\obj" $javaFiles
if ($LASTEXITCODE -ne 0) { throw "javac failed" }

# 9. Package class files into classes.jar
Push-Location "$buildDir\obj"
& $jar cvf "$buildDir\classes.jar" . | Out-Null
Pop-Location

# 10. Convert Class files to DEX with D8
Write-Host "Converting bytecode to Android DEX with d8..." -ForegroundColor Yellow
$env:JAVA_HOME = $jbr
& $d8 --lib "$androidJar" --output "$buildDir" "$buildDir\classes.jar"
if ($LASTEXITCODE -ne 0) { throw "d8 failed" }

# 11. Add classes.dex into app-unaligned.apk
Write-Host "Adding classes.dex to APK..." -ForegroundColor Yellow
Push-Location $buildDir
& $jar uf "app-unaligned.apk" "classes.dex"
Pop-Location

# 12. Zipalign APK
Write-Host "Aligning APK 4-byte boundaries with zipalign..." -ForegroundColor Yellow
$alignedApk = "$buildDir\app-aligned.apk"
if (Test-Path $alignedApk) { Remove-Item $alignedApk }
& $zipalign -v -p 4 "$buildDir\app-unaligned.apk" $alignedApk
if ($LASTEXITCODE -ne 0) { throw "zipalign failed" }

# 13. Keystore creation if not existing
$keystore = "$PSScriptRoot\debug.keystore"
if (-not (Test-Path $keystore)) {
    Write-Host "Generating debug signing keystore..." -ForegroundColor Yellow
    & $keytool -genkeypair -v `
        -keystore $keystore `
        -storepass android `
        -alias androiddebugkey `
        -keypass android `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -dname "CN=Android Debug,O=Android,C=US"
}

# 14. Sign APK with apksigner
Write-Host "Signing APK with apksigner (v1, v2, v3 schemes)..." -ForegroundColor Yellow
$finalApk = "$OutputDir\DeepHealthAI.apk"
if (Test-Path $finalApk) { Remove-Item $finalApk }

& cmd.exe /c "`"$apksigner`" sign --ks `"$keystore`" --ks-pass pass:android --key-pass pass:android --ks-key-alias androiddebugkey --out `"$finalApk`" `"$alignedApk`""
if ($LASTEXITCODE -ne 0) { throw "apksigner failed" }

# 15. Verify APK signature
Write-Host "Verifying APK signature..." -ForegroundColor Yellow
& cmd.exe /c "`"$apksigner`" verify `"$finalApk`""
if ($LASTEXITCODE -ne 0) { throw "apksigner verify failed" }

$apkItem = Get-Item $finalApk
$apkSizeMb = [math]::Round($apkItem.Length / 1MB, 2)
$apkSizeKb = [math]::Round($apkItem.Length / 1KB, 1)

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host " SUCCESS: Android APK Generated!        " -ForegroundColor Green
Write-Host " File: $finalApk" -ForegroundColor Green
Write-Host " Size: $apkSizeMb MB ($apkSizeKb KB)" -ForegroundColor Green
Write-Host " Package: io.deephealthindia.app        " -ForegroundColor Green
Write-Host " Target SDK: 34 (Android 14)            " -ForegroundColor Green
Write-Host " Min SDK: 24 (Android 7.0+)             " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
