import { apiSlice } from './apiSlice';

// Reemplaza la URL correcta de tus servicios de valores de tipo

const TYPE_VALUES_URL = 'http://localhost:10000/api/products';
//const TYPE_VALUES_URL = 'https://inv-b1.vercel.app/api/products';

export const typeValuesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    addProduct: builder.mutation({
      query: (object) => ({
        url: `${TYPE_VALUES_URL}/add-product`,
        method: 'POST',
        body: object.registro,
        headers: {
          Authorization: `Bearer ${object.token}`,
        },
      }),
    }),

    // updateProduct: builder.mutation({    
    //   query: (object) => ({
    //     url: `${TYPE_VALUES_URL}/update-product/${object.id}`,
    //     method: 'PUT',
    //     body: object.registro,
    //     headers: {
    //       Authorization: `Bearer ${object.token}`,
    //     },
    //   }),
    // }),    

    updateProduct: builder.mutation({
      query: (object) => {
        const apiUrl = `${TYPE_VALUES_URL}/update-product/${object.id}`;
        console.log("update object:", object);

        return {
          url: apiUrl,
          method: 'PUT',
          body: object.registro,
          headers: {
            Authorization: `Bearer ${object.token}`,
          },
        };
      },
    }),

    deleteProduct: builder.mutation({
      query: (object) => ({
        url: `${TYPE_VALUES_URL}/delete-product/${object.registro.id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${object.token}`,
        },
      }),
    }),

    getTypeValue: builder.query({
      query: (id, token) => ({
        url: `${TYPE_VALUES_URL}/get-products/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    //1
    getProductsByUserId: builder.query({
      query: (param) => {  //al parecer solo permite OBJETO de entrada!
        //console.log("param:", param); // Agregar un console.log aquí
        return {
          url: `${TYPE_VALUES_URL}/get-products/${param.data.idUsuario}`,
          headers: {
            Authorization: `Bearer ${param.token}`,
          },
        };
      },
    }),

    updateProductAmount: builder.mutation({
      query: (object) => {
        const apiUrl = `${TYPE_VALUES_URL}/update-product-amount/${object.productId}`;
        console.log("update object:", object);

        return {
          url: apiUrl,
          method: 'PUT',
          body: object.registro,
          headers: {
            Authorization: `Bearer ${object.token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetTypeValueQuery,
  useGetProductsByUserIdQuery,
  useUpdateProductAmountMutation,
} = typeValuesApiSlice;
