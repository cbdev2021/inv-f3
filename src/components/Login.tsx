import React, { FunctionComponent, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { setCredentials, setToken } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, TextField, Button } from '@mui/material';
import { useLoginMutation } from "../slices/usersApiSlice";
import { Link, useNavigate } from 'react-router-dom';

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginMutation, { isLoading }] = useLoginMutation();

  //const { userInfo } = useSelector((state: any) => state.auth);
  const userInfo = useSelector((state: any) => state);

  useEffect(() => {
    if (userInfo.auth.token) {
      navigate('/home'); 
    }
  }, [userInfo.token, navigate]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await loginMutation({ email, password }).unwrap();
      // console.log("res");
      // console.log(res);

      dispatch(setCredentials({
        userInfo: {
          // _id: res._id,
          _id: res.id,
          name: res.name,
          email: res.email,
          token: res.token
        },
        token: res.token
      }));

      console.log("inicio - userInfo.token:");
      console.log(userInfo);

      console.log("inicio - res.token:", res.token); // Agregar un console.log aquí                                    

      navigate('/home');
      // } catch (err) {
      //   console.error(err);
      //   toast.error('Hubo un error al iniciar sesión');
      // }
    } catch (err: any) {
      console.error(err);

      if (err.data && err.data.message === "Invalid email or password") {
        toast.error('Correo o contraseña incorrectos');
      } else {
        toast.error('Hubo un error al iniciar sesión');
      }
    }

  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  }, []);

  return (
    <div className="contenedor" style={{ display: 'flex' }}>
      <div className="mitad-izquierda" style={{ flex: '1' }}>

        <form onSubmit={submitHandler} className={"form"} style={{ width: '100%' }}>
          <Typography variant="h6" component="div" sx={{
            flexGrow: 1, fontFamily: 'Exo 2, sans-serif', fontSize: '4.8rem', fontWeight: 600, letterSpacing: '2px', textAlign: 'center',
            color: '#da48ff',
          }}>
            Inv
          </Typography>
   

          <Typography variant="h5" align="center" gutterBottom>
            Log In
          </Typography>

          <div className="form-elements-container">
            <TextField
              color="primary"
              variant="outlined"
              type="text"
              name="email"
              id="email"
              label="Email"
              placeholder="Insert Email"
              size="medium"
              margin="normal"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
            />
            <TextField
              color="primary"
              variant="outlined"
              type="password"
              name="password"
              id="password"
              label="Password"
              placeholder="Insert Password"
              size="medium"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              variant="contained"
              name="iniciar"
              id="idIniciar"
              color="primary"
              type="submit"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Log In
            </Button>
          </div>

          <div className={"noTienesCuentaContainer"}>
            <span>You don't have an account? </span>
            <Link to="/register" className={"registrate"}>
              <b className={"registrate"}>Sign Up</b>
            </Link>
          </div>
        </form>
      </div>

      <div className="mitad-derecha" style={{ flex: '1', backgroundColor: '#e0e0e0', padding: '20px' }}>
        <img
          src="./inventory2.jpg"
          alt="Inventario"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            margin: 'auto', // Centrar horizontalmente
            display: 'block',
            opacity: 0.35,
            marginTop: 'auto',
            marginBottom: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />

        {/* <Typography variant="h6" align="center" style={{ lineHeight: '1.5em', marginTop: '50px', fontFamily: 'Roboto, sans-serif', color: '#333', fontWeight: 'bold', fontSize: '14px'}}>
          Login to your account for instant access to your inventory, real-time updates, and a user-friendly interface that empowers you to take control of your business with confidence.
        </Typography> */}

        <Typography variant="h6" align="center" style={{ lineHeight: '1.5em', marginTop: '50px', fontFamily: 'Roboto, sans-serif', color: '#333', fontSize: '14px' }}>
          <b> Log In</b> to your account for instant access to your inventory, real-time updates, and a user-friendly interface that empowers you to take control of your business with confidence.
        </Typography>

      </div>
    </div>
  );
};

export default Login;
