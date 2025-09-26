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
        getResortsByUser: "/resort/get-resorts-by-user",
        getImagesByResort: "/resort/get-images-by-resort",
        getResortsById: "/resort/get-resort-by-id",
        updateResort: "/resort/update-resort",
        deleteResort: "/resort/delete-resort",
        getNewResorts: "/resort/get-new-resorts",
      },
      favorite: {
        addFavorite: "/favorite/add-favorite",
        deleteFavorite: "/favorite/delete-favorite",
      },
    },
  },
};
