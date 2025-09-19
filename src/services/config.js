export const config = {
  legacyBaseUrl: __DEV__ ? "http://192.168.1.136:3069" : " production.com",
  endpoints: {
    legacy: {
      auth: {
        signUp: "/auth/register",
        signIn: "/auth/login",
        checkAuth: "/auth/check-auth",
      },
      resort: {
        addResort: "/resort/add-resort",
        getResortsByUser: "/resort/get-resort-by-user",
      },
    },
  },
};
