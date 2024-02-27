import { apiSlice } from './apiSlice';

// Reemplaza la URL correcta de tus servicios de registro
const REGISTER_URL = 'http://localhost:10000/api/registers'; // Reemplaza con tu URL de registro
//const REGISTER_URL = 'https://inv-b1.vercel.app/api/registers';


export const registerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Agrega un nuevo usuario
        addRegister: builder.mutation({
            query: (object) => ({
                url: `${REGISTER_URL}/add-register`,
                method: 'POST',
                body: object.registro, // Asume que userData es el objeto del nuevo usuario
                headers: {
                    Authorization: `Bearer ${object.token}`,
                },
            }),
        }),

        // Actualiza los datos de un usuario existente
        updateRegister: builder.mutation({
            query: (object) => ({
                url: `${REGISTER_URL}/update-register/${object.id}`,
                method: 'PUT',
                body: object.registro, // Asume que updatedUserData es el objeto con los datos actualizados
                headers: {
                    Authorization: `Bearer ${object.token}`,
                },
            }),
        }),

        // Elimina un usuario
        deleteRegister: builder.mutation({
            query: (object) => ({
                url: `${REGISTER_URL}/delete-register/${object.registro.id}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${object.token}`,
                },
            }),
        }),

        // Obtiene los datos de un usuario por ID
        getRegisterById: builder.query({
            query: (id, token) => ({
                url: `${REGISTER_URL}/get-register/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),

        // Obtiene todos los usuarios por algún criterio (por ejemplo, filtrados por rol)
        getRegistersByCriteria: builder.query({
            query: (object) => ({
                url: `${REGISTER_URL}/get-registers/${object.data.idUsuario}`,
                //params: object.data.userId, 
                headers: {
                    Authorization: `Bearer ${object.token}`,
                },
            }),
        }),
    }),
});

export const {
    useAddRegisterMutation, // En lugar de useAddUserMutation
    useUpdateRegisterMutation, // En lugar de useUpdateUserMutation
    useDeleteRegisterMutation, // En lugar de useDeleteUserMutation
    useGetRegisterByIdQuery, // En lugar de useGetUserByIdQuery
    useGetRegistersByCriteriaQuery, // En lugar de useGetUsersByCriteriaQuery
} = registerApiSlice;

