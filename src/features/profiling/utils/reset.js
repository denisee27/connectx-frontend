// Centralized reset utility for profiling flow
// Clears all persisted inputs and resets form values to defaults

export const DEFAULT_PROFILE_VALUES = {
  name: "",
  age: "",
  gender: "",
  city: "",
  country: "",
  occupation: "",
  phoneNumber: "",
  email: "",
};

function safeRemove(storage, key) {
  try {
    storage.removeItem(key);
  } catch (_) {
    // ignore storage errors (private mode, quota, etc.)
  }
}

export function resetProfilingStorage() {
  // Local storage keys
  [
    "profilingAnswers",
    "profilingCurrentIndex",
    "profilingPreferences",
    "profilingMeetUpPref",
    "profilingProfile",
  ].forEach((k) => safeRemove(localStorage, k));

  // Session flags
  [
    "profilingReloadConfirmed",
    "profilingReloadOrigin",
    "profilingSkipRefreshModal",
  ].forEach((k) => safeRemove(sessionStorage, k));
}

export function resetProfilingForm(formReset) {
  if (typeof formReset === "function") {
    formReset(DEFAULT_PROFILE_VALUES);
  }
}

// Full reset: storage + form values
export function resetProfilingAll(formReset) {
  resetProfilingStorage();
  resetProfilingForm(formReset);
}