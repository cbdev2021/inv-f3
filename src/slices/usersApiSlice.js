import { apiSlice } from './apiSlice';
const USERS_URL = 'http://localhost:10000/api/users';
//const USERS_URL = 'https://inv-b1.vercel.app/api/users';
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    
    // updateUser: builder.mutation({
    //   query: (data) => ({
    //     url: `${USERS_URL}/profile`,
    //     method: 'PUT',
    //     body: data,
    //   }),
    // }),

    updateUser: builder.mutation({
      query: (data, token) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }),
    }),

    // updateUser: builder.mutation({
    //   query: (data) => ({
    //     url: `${USERS_URL}/profile`,
    //     method: 'PUT',
    //     body: {
    //       ...data, // Incluye todos los datos del usuario
    //       token: data.token, // Agrega el token aquí
    //     },
    //   }),
    // }),
  

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
} = userApiSlice;
