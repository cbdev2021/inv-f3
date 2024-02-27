import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    token: localStorage.getItem('token') || '',
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
      localStorage.setItem('token', action.payload.token);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = '';
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, setToken, logout } = authSlice.actions;
export default authSlice.reducer;

  



// import { createSlice } from '@reduxjs/toolkit';

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     userInfo: null,
//     token: '', // Agrega el token al estado inicial
//   },
//   reducers: {
//     setCredentials: (state, action) => {
//       state.userInfo = action.payload.userInfo;
//       state.token = action.payload.token; // Guarda el token en el estado
//     },
//     setToken: (state, action) => {
//       state.token = action.payload; // Actualiza el token en el estado
//     },
//     // Agrega otras acciones de autenticación aquí si es necesario
//     logout: (state, action) => {
//             state.userInfo = null;
//             localStorage.removeItem('userInfo');
          
//     }
//   },
// });

// export const { setCredentials, setToken, logout } = authSlice.actions;
// export default authSlice.reducer;


//vs 2

// import { createSlice } from '@reduxjs/toolkit';

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     // userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
//     // token: localStorage.getItem('token') || '',
//     userInfo:  null,
//     token: null,
//   },
//   reducers: {
//     setCredentials: (state, action) => {
//       state.userInfo = action.payload.userInfo;
//       // state.userInfo = {
//       //   _id: action.payload._id,
//       //   name: action.payload.name,
//       //   email: action.payload.email,
//       // };

//       state.token = action.payload.token;

//       state.aaaa = action.payload.token;
//       //localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
      
//       //localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
//       //localStorage.setItem('token', action.payload.token);

//       console.log("authslice state");
//       console.log(state.userInfo);
//     },
//     setToken: (state, action) => {
//       state.token = action.payload;
//       localStorage.setItem('token', action.payload);
//     },
//     logout: (state) => {
//       state.userInfo = null;
//       state.token = '';
//       localStorage.removeItem('userInfo');
//       localStorage.removeItem('token');
//     },
//   },
// });

// export const { setCredentials, setToken, logout } = authSlice.actions;
// export default authSlice.reducer;














