# Admin Authentication Troubleshooting Guide

## 🔐 Admin Login Issues

Jika Anda tidak dapat login sebagai admin, ikuti panduan ini untuk men-debug dan memperbaiki masalah.

---

## 🛠️ Development Mode (localhost/Codespaces)

Jika Anda mengembangkan di **localhost** atau **GitHub Codespaces**, debug panel akan muncul di **bottom-left** browser Anda.

### **Dev Debug Panel** 
```
⚠️ Yellow "Dev Debug" button di bottom-left
```

**Fitur:**
- ✅ Lihat email yang login
- ✅ Lihat admin status
- ✅ Enable/Disable admin mode (untuk testing)
- ✅ Copy hardcoded admin email
- ✅ Console commands untuk quick testing

### **Quick Start - Enable Test Admin** 

**Option 1: Via UI Panel**
1. Buka website
2. Klik tombol kuning **"Dev Debug"** di bottom-left
3. Klik **"Enable Admin"** (reload otomatis)
4. Login dengan Google account apapun
5. Dashboard akan accessible sebagai admin

**Option 2: Via Console**
```javascript
// Buka DevTools (F12) → Console tab
window.enableTestAdmin()
// Refresh page (Ctrl+R / Cmd+R)
```

**Option 3: Check Admin Status**
```javascript
window.checkAdminStatus()
// Output: Dev Admin Mode enabled, etc.
```

---

## 🔒 Production Mode (GitHub Pages)

### **Hardcoded Admin Email**
```
eleazaragungnugroho@gmail.com
```

Hanya email ini yang bisa login sebagai admin di production.

### **Setup Google OAuth di Firebase Console**

Jika admin login masih tidak bekerja di production, follow langkah ini:

#### **1. Buka Firebase Console**
- Go to: https://console.firebase.google.com/
- Select project: `gen-lang-client-0386352812`

#### **2. Enable Google Auth Provider**
```
Authentication → Sign-in method → Google
```

**Required:**
- ✅ Status: Enabled
- ✅ Support email: (sudah ada)

#### **3. Configure Authorized Domains**
```
Authentication → Settings → Authorized domains
```

**Add GitHub Pages URL:**
```
digiworkinc.github.io
```

#### **4. Configure OAuth Consent Screen (jika diperlukan)**
```
APIs & Services → OAuth consent screen
```

Create or update:
- **App name:** AVAI-ORIOS
- **User support email:** (your email)
- **Developer contact:** (your email)
- **Authorized domains:** digiworkinc.github.io

#### **5. Test Login**
1. Go to: https://digiworkinc.github.io/avai-orios/
2. Click "Admin Login"
3. Login dengan email: `eleazaragungnugroho@gmail.com`
4. Email harus verified di Google account

---

## 🐛 Common Issues & Fixes

### **Issue 1: "Nothing happens when clicking Admin Login"**

**Cause:** Google OAuth popup diblock atau error terjadi

**Fix:**
```javascript
// Check console untuk errors (F12 → Console)
// Harus ada error message yang jelas

// If you see Firebase error:
// "auth/operation-not-supported-in-this-environment"
// → Need memperbaiki CORS atau domain configuration
```

**Solution:**
1. Check DevTools Console (F12) untuk error message
2. Verify domain di Firebase Console → Authorized domains
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito/private window

### **Issue 2: "Login berhasil tapi tidak bisa akses admin"**

**Cause:** Email tidak sesuai hardcoded email atau permission issue

**Fix (Development):**
- Gunakan **Dev Debug Panel** → "Enable Admin"
- Atau run: `window.enableTestAdmin()`

**Fix (Production):**
1. Email harus: `eleazaragungnugroho@gmail.com`
2. Email harus **verified** di Google account
3. Check Firestore permissions (firestore.rules)

### **Issue 3: "Firebase error saat checking admin"**

**Cause:** Firestore permission denied atau connection error

**Fix:**
```javascript
// Dev mode: Automatic fallback dengan localStorage override
// Production: Check firestore.rules dan Firebase permissions

// Enable dev admin untuk testing:
window.enableTestAdmin()
```

**Check Firestore Rules:**
```
File: firestore.rules
Verify rules allow user read/write to /users/{uid}
```

### **Issue 4: "Admin Dashboard tidak load"**

**Cause:** Component lazy loading error

**Fix:**
1. Check console untuk error (F12 → Console)
2. Clear cache: Ctrl+Shift+Delete
3. Try different browser
4. Verify code-splitting chunks loaded correctly

---

## 📊 Debug Info Checklist

Ketika troubleshooting, collect informasi ini:

```javascript
// Run di console (F12 → Console):
window.checkAdminStatus()

// Output akan menunjukkan:
✅ Dev Admin Mode: true/false
✅ Dev Mode: true/false  
✅ Hardcoded Admin Email: eleazaragung...
```

**Plus capture:**
- 📸 Screenshot console output
- 🌐 Browser URL
- 🔍 Network tab → check XHR/Fetch requests
- 🔐 User email saat ini

---

## 🎯 Firebase Configuration Summary

| Setting | Value |
|---------|-------|
| **Project ID** | `gen-lang-client-0386352812` |
| **Auth Method** | Google Sign-in |
| **Authorized Domains** | `digiworkinc.github.io` |
| **Admin Email** | `eleazaragungnugroho@gmail.com` |
| **Database** | Cloud Firestore |
| **Database ID** | `ai-studio-8c60b78f-35a3-49c3-accd-d98733e7ecce` |

---

## 🚀 Testing Checklist

### **Development (localhost)**
- [ ] Debug panel visible (bottom-left)
- [ ] Can click "Enable Admin"
- [ ] Can access dashboard after enabling
- [ ] Console shows admin status

### **Production (GitHub Pages)**
- [ ] Can click "Admin Login"
- [ ] Google popup appears
- [ ] Can login dengan hardcoded email
- [ ] Dashboard appears after verification

---

## 📱 Mobile Testing

Admin login di mobile mungkin memerlukan:

1. **Clear app cache:**
   - Settings → Apps → Browser → Clear Cache
   
2. **Use incognito mode:**
   - Buka incognito window baru
   
3. **Check permissions:**
   - Browser might block popups
   - Check: Settings → Popups & redirects

---

## 💡 Advanced Debugging

### **Enable Detailed Logging**
```javascript
// In console:
window.logAdminDebug = true // (pseudo code)
// Check Firebase SDK logs di console
```

### **Check Network Requests**
```
DevTools → Network tab
- Cari: googleapis.com (Google Auth API)
- Cari: firebaseio.com (Firestore)
- Check response status (200 OK atau error)
```

### **Verify Firebase Connection**
```javascript
// Di console:
import { auth, db } from './src/firebase'

// Check if initialized
console.log(auth)  // Should show Firebase Auth instance
console.log(db)    // Should show Firestore instance
```

---

## 🔗 Useful Links

- **Firebase Console:** https://console.firebase.google.com/
- **GitHub Pages Settings:** https://github.com/Digiworkinc/avai-orios/settings/pages
- **Firebase Docs:** https://firebase.google.com/docs/auth/web/google-signin
- **Firestore Rules:** https://firebase.google.com/docs/firestore/security/start

---

## 📞 Still Not Working?

Jika sudah mengikuti semua langkah tapi masih tidak bekerja:

1. **Collect debug info:**
   ```javascript
   window.checkAdminStatus() // Copy output
   // + screenshot console errors
   ```

2. **Check these files:**
   - `firebase-applet-config.json` - Firebase credentials
   - `firestore.rules` - Database permissions
   - `src/firebase.ts` - Firebase initialization
   - `.env` - Environment variables

3. **Try production reset:**
   - Commit all changes
   - Run: `npm run deploy`
   - Wait 2-3 minutes
   - Hard refresh (Ctrl+Shift+R)

---

**Happy debugging! 🎉**
