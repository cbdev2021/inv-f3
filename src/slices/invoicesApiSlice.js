import { apiSlice } from './apiSlice';

// Reemplaza la URL correcta de tus servicios de valores de tipo

const INVOICES_URL = 'http://localhost:10000/api/invoices';
//const INVOICES_URL = 'https://inv-b1.vercel.app/api/invoices';

export const invoicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addInvoice: builder.mutation({
      query: (object) => ({
        url: `${INVOICES_URL}/add-invoice`,
        method: 'POST',
        body: object.registro,
        headers: {
          Authorization: `Bearer ${object.token}`,
        },
      }),
    }),

    updateInvoice: builder.mutation({
      query: (object) => ({
        url: `${INVOICES_URL}/update-invoice/${object.id}`,
        method: 'PUT',
        body: object.registro,
        headers: {
          Authorization: `Bearer ${object.token}`,
        },
      }),
    }),

    // updateInvoice: builder.mutation({
    //   query: (object) => {
    //     const apiUrl = `${INVOICES_URL}/update-invoice/${object.id}`;
    //     console.log("update object:", object);
    //     return {
    //       url: apiUrl,
    //       method: 'PUT',
    //       body: object.registro,
    //       headers: {
    //         Authorization: `Bearer ${object.token}`,
    //       },
    //     };
    //   },
    // }),

    deleteInvoice: builder.mutation({
      query: (object) => ({
        url: `${INVOICES_URL}/delete-invoice/${object.registro.id}`,   //
        //url: `${INVOICES_URL}/delete-invoice/${object.registro.invoiceID}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${object.token}`,
        },
      }),
    }),

    getInvoice: builder.query({
      query: (id, token) => ({
        url: `${INVOICES_URL}/get-invoices/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    //1
    getInvoicesByUserId: builder.query({
      query: (param) => {  //al parecer solo permite OBJETO de entrada!
        //console.log("param:", param); // Agregar un console.log aquí
        return {
          url: `${INVOICES_URL}/get-invoices/${param.data.idUsuario}`,
          headers: {
            Authorization: `Bearer ${param.token}`,
          },
        };
      },
    }),


    getGenerateIdInvoice: builder.query({
      query: (object) => ({
        url: `${INVOICES_URL}/generate-id/${object.data.invoiceId}`,
        headers: {
          Authorization: `Bearer ${object.token}`,
        },
      }),
    }),


  }),
});

export const {
  useAddInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetInvoiceQuery,
  useGetInvoicesByUserIdQuery,
  //useGetGenerateIdInvoice,
  useGetGenerateIdInvoiceQuery,
} = invoicesApiSlice;
