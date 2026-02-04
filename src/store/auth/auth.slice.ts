import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authService } from "./../../services/auth/auth.service";
import { setUser as persistUser, setToken as persistToken } from "../../util/helpers/auth.helper";
import type { AuthResponse, AuthState, User } from "./../../types/auth.type";

const initialState: AuthState = {
  user: authService.getUser(),
  token: authService.getToken(),
  isAuthenticated: !!authService.getToken(),

  isLoading: false,
  error: null,
};

// Helper to extract error message safely
const getErrorMessage = (err: unknown, fallback = "Something went wrong") => {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return String((err as any).message);
  }
  return fallback;
};

// ---------- Thunks ----------
export const loginUser = createAsyncThunk<AuthResponse,{ email: string; password: string },{ rejectValue: string }>("auth/loginUser", async ({ email, password }, thunkAPI) => {
  try {
    // return await authService.login(email, password);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      getErrorMessage(err, "Login failed");
    return thunkAPI.rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async ({ name, email, password }, thunkAPI) => {
  try {
    // Simulate a local registration flow without calling remote APIs.
    const user: User = { id: String(Date.now()), name, email };
    const token = `local-token-${Math.random().toString(36).slice(2)}`;

    // Persist locally so the app can reload the authenticated state
    try {
      persistToken(token);
      persistUser(user);
    } catch (err) {
      // ignore storage errors
    }

    // Small artificial delay to mimic async behavior
    await new Promise((res) => setTimeout(res, 250));

    return { user, token } as AuthResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const message = getErrorMessage(err, "Register failed");
    return thunkAPI.rejectWithValue(message);
  }
});

export const resetPassword = createAsyncThunk<boolean, { email: string }, { rejectValue: string }>(
  "auth/resetPassword",
  async ({ email }, thunkAPI) => {
    try {
      // simulate sending reset email
      await new Promise((res) => setTimeout(res, 250));
      return true;
    } catch (err: any) {
      const message = getErrorMessage(err, "Reset password failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const newPassword = createAsyncThunk<boolean, { token?: string; password: string }, { rejectValue: string }>(
  'auth/newPassword',
  async ({ token, password }, thunkAPI) => {
    try {
      // simulate applying new password (would normally use token + API)
      await new Promise((res) => setTimeout(res, 250));
      return true;
    } catch (err: any) {
      const message = getErrorMessage(err, 'Set new password failed');
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk<boolean,void,{ rejectValue: string }>("auth/logoutUser", async (_, thunkAPI) => {
  try {
    await authService.logout();
    return true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Logout error:", err);
    return thunkAPI.rejectWithValue("Logout failed");
  }
});

// ---------- Slice ----------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },

    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- LOGIN ----
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
      })

      // ---- REGISTER ----
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Register failed";
      })

      // ---- LOGOUT ----
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
    // resetPassword handled below to avoid doubling builder chain
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Reset failed';
      });
    builder
      .addCase(newPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(newPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(newPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Set new password failed';
      });
  },
});

export const { clearAuthError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
