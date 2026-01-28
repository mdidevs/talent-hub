import { authService } from "../../services/auth/auth.service";

const initialState = {
  user: authService.getUser(),
  token: authService.getToken(),
  isAuthenticated: !!authService.getToken(),

  isLoading: false,
  error: null, // string
};

export default initialState;
