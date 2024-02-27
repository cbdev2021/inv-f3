import { apiSlice } from './apiSlice';

// Reemplaza la URL correcta de tus servicios de valores de tipo

const TYPE_VALUES_URL = 'http://localhost:10000/api/type-value';
//const TYPE_VALUES_URL = 'https://inv-b1.vercel.app/api/type-value';

export const typeValuesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // addTypeValue: builder.mutation({
    //   query: (data, token) => ({
    //     url: `${TYPE_VALUES_URL}/add-type-value`,
    //     method: 'POST',
    //     body: data,
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }),
    // }),
    
    addTypeValue: builder.mutation({
      query: (object) => ({
        url: `${TYPE_VALUES_URL}/add-type-value`,
        method: 'POST',
        body: object.registro,
        headers: {
          Authorization: `Bearer ${object.token}`,
        },
      }),
    }),


    
    // addTypeValue: builder.mutation({
    //   query: (data) => ({
    //     url: `${TYPE_VALUES_URL}/add-type-value`,
    //     method: 'POST',
    //     body: data,
    //     headers: {
    //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTBkMzJmOTYzODZkYjBiNzBkMDk0NWUiLCJpYXQiOjE2OTYxMzUzMDEsImV4cCI6MTY5ODcyNzMwMX0.VzpwJiQAvRmc0G3WZzlpTMzSeYWYmhVhWKkVuxN_sKQ`,
    //       },
    //   }),
    // }),

    // updateTypeValue: builder.mutation({
    //   query: (id, data ) => ({
    //     url: `${TYPE_VALUES_URL}/update-type-value/${id}`,
    //     method: 'PUT',
    //     body: data,
    //     headers: {
    //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTBkMzJmOTYzODZkYjBiNzBkMDk0NWUiLCJpYXQiOjE2OTYxMzUzMDEsImV4cCI6MTY5ODcyNzMwMX0.VzpwJiQAvRmc0G3WZzlpTMzSeYWYmhVhWKkVuxN_sKQ`,
    //     },
    //   }),
    // }),
   
      // updateTypeValue: builder.mutation({
      //   query: ({ id, data }) => ({
      //     url: `${TYPE_VALUES_URL}/update-type-value/${id}`,
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json', // Agregar encabezado Content-Type
      //       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTBkMzJmOTYzODZkYjBiNzBkMDk0NWUiLCJpYXQiOjE2OTYxMzUzMDEsImV4cCI6MTY5ODcyNzMwMX0.VzpwJiQAvRmc0G3WZzlpTMzSeYWYmhVhWKkVuxN_sKQ`,
      //     },
      //     body: JSON.stringify(data), // Asegurarse de convertir el objeto data a JSON
      //   }),
      // }),

    updateTypeValue: builder.mutation({
      query: (object) => ({
        url: `${TYPE_VALUES_URL}/update-type-value/${object.data.id}`,
        method: 'PUT',
        body: object.data.registro,
        headers: {
          Authorization: `Bearer ${object.data.token}`,
        },
      }),
    }),    

    // deleteTypeValue: builder.mutation({
    //   query: (id) => ({
    //     url: `${TYPE_VALUES_URL}/delete-type-value/${id}`,
    //     method: 'DELETE',
    //     headers: {
    //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTBkMzJmOTYzODZkYjBiNzBkMDk0NWUiLCJpYXQiOjE2OTYxMzUzMDEsImV4cCI6MTY5ODcyNzMwMX0.VzpwJiQAvRmc0G3WZzlpTMzSeYWYmhVhWKkVuxN_sKQ`,
    //     },
    //   }),
    // }),

    deleteTypeValue: builder.mutation({
      query: (object) => ({
        url: `${TYPE_VALUES_URL}/delete-type-value/${object.data.id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${object.data.token}`,
        },
      }),
    }),

    
    getTypeValue: builder.query({
      query: (id, token) => ({
        url: `${TYPE_VALUES_URL}/get-type-value/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),


    //1
    getTypeValuesByUserId: builder.query({
      query: (param) => {  //al parecer solo permite OBJETO de entrada!
        console.log("type value:", param); // Agregar un console.log aquí
        return {
          url: `${TYPE_VALUES_URL}/get-type-values/${param.idUsuario}`,
          headers: {
            Authorization: `Bearer ${param.token}`, 
          },
        };
      },
    }),

    // getTypeValuesByUserId: builder.query({
    //   query: (idUsuario, token) => {
    //     console.log("type value:", param); // Agregar un console.log aquí
    //     return {
    //       url: `${TYPE_VALUES_URL}/get-type-values/${idUsuario}`,
    //       headers: {
    //         Authorization: `Bearer ${token}`, 
    //       },
    //     };
    //   },
    // }),
         
  }),
});

export const {
  useAddTypeValueMutation,
  useUpdateTypeValueMutation,
  useDeleteTypeValueMutation,
  useGetTypeValueQuery,
  useGetTypeValuesByUserIdQuery,
} = typeValuesApiSlice;
