import { createSlice } from '@reduxjs/toolkit'

const TOKEN_KEY = 'algoforge_token'

function loadToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

const initialState = {
  user: null,
  token: loadToken(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { token, user } = action.payload
      state.token = token ?? null
      state.user = user ?? null
      try {
        if (state.token) localStorage.setItem(TOKEN_KEY, state.token)
        else localStorage.removeItem(TOKEN_KEY)
      } catch {
        /* ignore */
      }
    },
    logout(state) {
      state.token = null
      state.user = null
      try {
        localStorage.removeItem(TOKEN_KEY)
      } catch {
        /* ignore */
      }
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice
