# Deep Health AI — Figma Prototype Connection Tokens & Specification
Generated for: Deep Health AI Mobile Application (Android & iOS)
Platform Architecture: Figma Variables / Interaction Tokens & Flow Links
Primary Brand Anchor: #0D5C75 (Deep Clinical Teal)

---

## 1. Prototype Global Tokens (Timing & Easing)

| Token Name | Value | Purpose / Usage |
| :--- | :--- | :--- |
| `proto.transition.duration.instant` | `0ms` | Direct tab-bar switching across root destinations |
| `proto.transition.duration.quick` | `200ms` | In-place status toggles, toasts, micro-feedback |
| `proto.transition.duration.standard` | `300ms` | Push / Pop hierarchical navigation slides |
| `proto.transition.duration.modal` | `350ms` | Bottom sheet presentations, HUD camera overlays |
| `proto.transition.duration.flow` | `400ms` | Splash sequence, scan processing cross-dissolves |
| `proto.easing.default` | `cubic-bezier(0.2, 0.0, 0, 1.0)` | Natural iOS / Material 3 ease-out |
| `proto.easing.modal` | `cubic-bezier(0.32, 0.72, 0, 1.0)` | Bottom sheet deceleration curve |
| `proto.easing.dismiss` | `cubic-bezier(0.4, 0.0, 0.6, 1.0)` | Acceleration curve for modal dismissals |

---

## 2. Interactive Navigation Matrix & Connection Tokens

### A. Global Bottom Navigation & Header Bar
*Applied consistently to all root tab screens: Dashboard, Reports, Plans, Profile.*

```json
[
  {
    "source_component": "BottomNav_Tab_Home",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "03. Home Dashboard",
    "target_id": "SCREEN_36",
    "animation": { "type": "INSTANT" },
    "navigation_type": "RESET_STACK_TO_ROOT"
  },
  {
    "source_component": "BottomNav_FAB_Scan",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "06. Face Positioning HUD",
    "target_id": "SCREEN_33",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "TOP",
      "duration": 350,
      "easing": "proto.easing.modal"
    },
    "navigation_type": "MODAL_PRESENTATION"
  },
  {
    "source_component": "BottomNav_Tab_Reports",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "11. Wellness Report Summary",
    "target_id": "SCREEN_29",
    "animation": { "type": "INSTANT" },
    "navigation_type": "RESET_STACK_TO_ROOT"
  },
  {
    "source_component": "BottomNav_Tab_Plans",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "01. Plans & Subscriptions",
    "target_id": "SCREEN_13",
    "animation": { "type": "INSTANT" },
    "navigation_type": "RESET_STACK_TO_ROOT"
  },
  {
    "source_component": "BottomNav_Tab_Profile",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "16. Profile Overview",
    "target_id": "SCREEN_8",
    "animation": { "type": "INSTANT" },
    "navigation_type": "RESET_STACK_TO_ROOT"
  },
  {
    "source_component": "Header_Bell_Notifications",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "17. Notifications Center",
    "target_id": "SCREEN_7",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    },
    "navigation_type": "PUSH"
  },
  {
    "source_component": "Header_Avatar_Pill",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "16. Profile Overview",
    "target_id": "SCREEN_8",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    },
    "navigation_type": "PUSH"
  }
]
```

---

### B. Onboarding & Authentication Flow

```json
[
  {
    "source_screen": "01. Splash Screen",
    "source_id": "SCREEN_37",
    "trigger": "AFTER_TIMEOUT",
    "timeout_ms": 2500,
    "action": "NAVIGATE_TO",
    "target_screen": "02. Language Selection",
    "target_id": "SCREEN_35",
    "animation": {
      "type": "DISSOLVE",
      "duration": 400,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "02. Language Selection",
    "source_element": "btn_continue",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "Onboarding 01 — Understand Your Wellness",
    "target_id": "SCREEN_26",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "Onboarding 01 — Understand Your Wellness",
    "source_element": "btn_continue",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "Onboarding 02 — Scan. Understand. Track.",
    "target_id": "SCREEN_25",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "Onboarding 01 — Understand Your Wellness",
    "source_element": "btn_skip",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "Sign In — Deep Health AI",
    "target_id": "SCREEN_22",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 350,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "Onboarding 02 — Scan. Understand. Track.",
    "source_element": "btn_continue",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "Onboarding 03 — See Your Wellness Journey",
    "target_id": "SCREEN_23",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "Onboarding 02 — Scan. Understand. Track.",
    "source_element": "btn_back",
    "trigger": "ON_TAP",
    "action": "BACK",
    "target_screen": "Onboarding 01 — Understand Your Wellness",
    "target_id": "SCREEN_26",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "RIGHT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "Onboarding 03 — See Your Wellness Journey",
    "source_element": "btn_get_started",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "Sign In — Deep Health AI",
    "target_id": "SCREEN_22",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "Sign In — Deep Health AI",
    "source_element": "btn_sign_in",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "03. Home Dashboard",
    "target_id": "SCREEN_36",
    "animation": {
      "type": "DISSOLVE",
      "duration": 350,
      "easing": "proto.easing.default"
    },
    "navigation_type": "RESET_STACK_TO_ROOT"
  },
  {
    "source_screen": "Sign In — Deep Health AI",
    "source_element": "link_create_account",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "Registration — Deep Health AI",
    "target_id": "SCREEN_19",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "Sign In — Deep Health AI",
    "source_element": "link_forgot_password",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "Forgot Password — Deep Health AI",
    "target_id": "SCREEN_21",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "Registration — Deep Health AI",
    "source_element": "btn_create_account",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "OTP Verification — Deep Health AI",
    "target_id": "SCREEN_15",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "Registration — Deep Health AI",
    "source_element": "link_sign_in",
    "trigger": "ON_TAP",
    "action": "BACK",
    "target_screen": "Sign In — Deep Health AI",
    "target_id": "SCREEN_22",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "RIGHT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "OTP Verification — Deep Health AI",
    "source_element": "btn_verify_and_continue",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "03. Home Dashboard",
    "target_id": "SCREEN_36",
    "animation": {
      "type": "DISSOLVE",
      "duration": 350,
      "easing": "proto.easing.default"
    },
    "navigation_type": "RESET_STACK_TO_ROOT"
  },
  {
    "source_screen": "Forgot Password — Deep Health AI",
    "source_element": "btn_send_verification",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "OTP Verification — Deep Health AI",
    "target_id": "SCREEN_15",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "Reset Password — Deep Health AI",
    "source_element": "btn_reset_and_sign_in",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "Sign In — Deep Health AI",
    "target_id": "SCREEN_22",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  }
]
```

---

### C. Biometric Telemetry & Live Optical Scan Flow

```json
[
  {
    "source_screen": "03. Home Dashboard",
    "source_element": "btn_hero_start_scan",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "06. Face Positioning HUD",
    "target_id": "SCREEN_33",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "TOP",
      "duration": 350,
      "easing": "proto.easing.modal"
    },
    "navigation_type": "MODAL_PRESENTATION"
  },
  {
    "source_screen": "06. Face Positioning HUD",
    "source_element": "btn_begin_scan",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "07. Live 30-Second Scan",
    "target_id": "SCREEN_32",
    "animation": {
      "type": "DISSOLVE",
      "duration": 250,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "06. Face Positioning HUD",
    "source_element": "nav_back_arrow",
    "trigger": "ON_TAP",
    "action": "BACK",
    "target_screen": "03. Home Dashboard",
    "target_id": "SCREEN_36",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "BOTTOM",
      "duration": 300,
      "easing": "proto.easing.dismiss"
    }
  },
  {
    "source_screen": "07. Live 30-Second Scan",
    "trigger": "AFTER_TIMEOUT",
    "timeout_ms": 30000,
    "action": "NAVIGATE_TO",
    "target_screen": "08. Scan Processing",
    "target_id": "SCREEN_27",
    "animation": {
      "type": "DISSOLVE",
      "duration": 400,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "08. Scan Processing",
    "trigger": "AFTER_TIMEOUT",
    "timeout_ms": 3000,
    "action": "NAVIGATE_TO",
    "target_screen": "09. Scan Success",
    "target_id": "SCREEN_31",
    "animation": {
      "type": "SMART_ANIMATE",
      "duration": 350,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "09. Scan Success",
    "source_element": "btn_view_report",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "11. Wellness Report Summary",
    "target_id": "SCREEN_29",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "09. Scan Success",
    "source_element": "btn_back_to_dashboard",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "03. Home Dashboard",
    "target_id": "SCREEN_36",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "RIGHT",
      "duration": 300,
      "easing": "proto.easing.default"
    },
    "navigation_type": "RESET_STACK_TO_ROOT"
  }
]
```

---

### D. Wellness Reports & Telemetry Flow

```json
[
  {
    "source_screen": "11. Wellness Report Summary",
    "source_element": "card_score_breakdown",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "AI Wellness Score Breakdown & Telemetry",
    "target_id": "SCREEN_2",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "11. Wellness Report Summary",
    "source_element": "nav_back_arrow",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "03. Home Dashboard",
    "target_id": "SCREEN_36",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "RIGHT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "AI Wellness Score Breakdown & Telemetry",
    "source_element": "nav_back_arrow",
    "trigger": "ON_TAP",
    "action": "BACK",
    "target_screen": "11. Wellness Report Summary",
    "target_id": "SCREEN_29",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "RIGHT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "AI Wellness Score Breakdown & Telemetry",
    "source_element": "btn_export_fhir",
    "trigger": "ON_TAP",
    "action": "OPEN_OVERLAY",
    "overlay_type": "BOTTOM_SHEET",
    "target_component": "Sheet_FHIR_Export_Progress",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "TOP",
      "duration": 250,
      "easing": "proto.easing.modal"
    }
  }
]
```

---

### E. Plans, Purchases, Points & Referrals Ecosystem

```json
[
  {
    "source_screen": "01. Plans & Subscriptions",
    "source_element": "btn_choose_pro_matrix",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "03. Purchase Confirmation",
    "target_id": "SCREEN_12",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "01. Plans & Subscriptions",
    "source_element": "nav_back_arrow",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "03. Home Dashboard",
    "target_id": "SCREEN_36",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "RIGHT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "03. Purchase Confirmation",
    "source_element": "btn_proceed_to_payment",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "05. Payment Successful",
    "target_id": "SCREEN_11",
    "animation": {
      "type": "DISSOLVE",
      "duration": 350,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "03. Purchase Confirmation",
    "source_element": "btn_cancel_and_return",
    "trigger": "ON_TAP",
    "action": "BACK",
    "target_screen": "01. Plans & Subscriptions",
    "target_id": "SCREEN_13",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "RIGHT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "05. Payment Successful",
    "source_element": "btn_start_wellness_scan",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "06. Face Positioning HUD",
    "target_id": "SCREEN_33",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "TOP",
      "duration": 350,
      "easing": "proto.easing.modal"
    },
    "navigation_type": "MODAL_PRESENTATION"
  },
  {
    "source_screen": "05. Payment Successful",
    "source_element": "btn_go_to_dashboard",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "03. Home Dashboard",
    "target_id": "SCREEN_36",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "RIGHT",
      "duration": 300,
      "easing": "proto.easing.default"
    },
    "navigation_type": "RESET_STACK_TO_ROOT"
  },
  {
    "source_screen": "09. Points Wallet",
    "source_element": "btn_refer_and_earn",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "11. Refer & Earn",
    "target_id": "SCREEN_9",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "09. Points Wallet",
    "source_element": "btn_redeem_in_plans",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "01. Plans & Subscriptions",
    "target_id": "SCREEN_13",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "11. Refer & Earn",
    "source_element": "btn_copy_referral_code",
    "trigger": "ON_TAP",
    "action": "OPEN_OVERLAY",
    "overlay_type": "SNACKBAR_TOAST",
    "target_component": "Toast_Code_Copied",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "BOTTOM",
      "duration": 200,
      "easing": "proto.easing.default"
    }
  }
]
```

---

### F. Profile, Settings, Notifications & Support Desk

```json
[
  {
    "source_screen": "16. Profile Overview",
    "source_element": "btn_manage_plan",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "01. Plans & Subscriptions",
    "target_id": "SCREEN_13",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "16. Profile Overview",
    "source_element": "row_wellness_reports",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "11. Wellness Report Summary",
    "target_id": "SCREEN_29",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "16. Profile Overview",
    "source_element": "row_points_wallet",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "09. Points Wallet",
    "target_id": "SCREEN_10",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "16. Profile Overview",
    "source_element": "row_referrals_and_rewards",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "11. Refer & Earn",
    "target_id": "SCREEN_9",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "16. Profile Overview",
    "source_element": "row_notifications",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "17. Notifications Center",
    "target_id": "SCREEN_7",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "16. Profile Overview",
    "source_element": "row_settings_and_privacy",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "18. Settings & Privacy",
    "target_id": "SCREEN_6",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "16. Profile Overview",
    "source_element": "row_help_and_support",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "20. Help & Support Desk",
    "target_id": "SCREEN_4",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "16. Profile Overview",
    "source_element": "btn_logout",
    "trigger": "ON_TAP",
    "action": "OPEN_OVERLAY",
    "overlay_type": "BOTTOM_SHEET",
    "target_component": "Sheet_Logout_Confirmation",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "TOP",
      "duration": 250,
      "easing": "proto.easing.modal"
    }
  },
  {
    "source_screen": "17. Notifications Center",
    "source_element": "btn_view_wellness_report",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "11. Wellness Report Summary",
    "target_id": "SCREEN_29",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "17. Notifications Center",
    "source_element": "btn_view_points_wallet",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "09. Points Wallet",
    "target_id": "SCREEN_10",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "LEFT",
      "duration": 300,
      "easing": "proto.easing.default"
    }
  },
  {
    "source_screen": "18. Settings & Privacy",
    "source_element": "btn_logout_session",
    "trigger": "ON_TAP",
    "action": "NAVIGATE_TO",
    "target_screen": "Sign In — Deep Health AI",
    "target_id": "SCREEN_22",
    "animation": {
      "type": "DISSOLVE",
      "duration": 300,
      "easing": "proto.easing.default"
    },
    "navigation_type": "RESET_STACK_TO_ROOT"
  },
  {
    "source_screen": "20. Help & Support Desk",
    "source_element": "btn_submit_support_ticket",
    "trigger": "ON_TAP",
    "action": "OPEN_OVERLAY",
    "overlay_type": "BOTTOM_SHEET",
    "target_component": "Sheet_Ticket_Submitted_Success",
    "animation": {
      "type": "SLIDE_IN",
      "direction": "TOP",
      "duration": 250,
      "easing": "proto.easing.modal"
    }
  }
]
```

---

## 3. Figma Prototype Import Checklist
1. **Connect Start Frame:** Set `01. Splash Screen` (`SCREEN_37`) as the prototype starting point (`Flow 1`).
2. **Apply Variable Tokens:** Map `proto.transition.duration.*` and `proto.easing.*` to local timing variables in Figma.
3. **Bottom Navigation Component:** Ensure the persistent `BottomNav` is an interactive master component that uses the `Reset scroll position` and `Reset component state` properties for tab switches.
4. **Modal Overlays:** Configure modal targets (`06. Face Positioning HUD`, `Sheet_Logout_Confirmation`, `Sheet_FHIR_Export_Progress`) with background dim set to `rgba(7, 28, 36, 0.45)` with tap-outside-to-dismiss behavior.
5. **Back Button Action:** Ensure all secondary back chevrons use native Figma `Back` (`Pop previous frame`) to preserve user history.
