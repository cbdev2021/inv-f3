import React, { FunctionComponent, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { setCredentials, setToken } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useRegisterMutation } from "../slices/usersApiSlice";
import { Link, useNavigate } from 'react-router-dom';

const isValidEmail = (email: string) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

const Register: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerMutation, { isLoading }] = useRegisterMutation();

  const handleEmailValidation = (email: string) => {
    console.log("ValidateEmail was called with", email);

    const isValid = isValidEmail(email);

    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Verificar si los términos y condiciones han sido aceptados
      if (!acceptTerms) {
        toast.warning('Por favor, acepta nuestros términos y condiciones.');
        return;
      }

      if (!name || !email || !password) {
        toast.error('Por favor, completa todos los campos.');
        return;
      }

      if (!handleEmailValidation(email)) {
        toast.error('Por favor, ingresa un email válido.');
        return;
      }


      const userData = await registerMutation({ name, email, password });
      console.log('Usuario registrado:', userData);
      //dispatch(setCredentials({ ...userData }));
      navigate('/login');
      toast.info('Usuario registrado exitosamente');

    } catch (err) {
      console.error('Error de registro:', err);
      const errorMessage = err as Error;
      toast.error(errorMessage.message || 'Error de registro');
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

        <form onSubmit={handleRegister} className={"form"} style={{ width: '100%' }}>
          <Typography variant="h6" component="div" sx={{
            flexGrow: 1, fontFamily: 'Exo 2, sans-serif', fontSize: '4.8rem', fontWeight: 600, letterSpacing: '2px', textAlign: 'center',
            color: '#da48ff',
          }}>
            Inv
          </Typography>

          <Typography variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>

          <div className="form-elements-container">

            {/* <Typography align="center" style={{ lineHeight: '1.5em' }}>
              <b>Welcome</b>, we want that you use <b>Inv</b> for your business to obtain the best results.
              To start to use our web app, complete the next register form!
            </Typography> */}




            <TextField
              color="primary"
              variant="outlined"
              type="text"
              name="name"
              id="name"
              label="Name"
              placeholder="Insert Name"
              size="medium"
              margin="normal"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              autoComplete="name"
            />
            <TextField
              color="primary"
              variant="outlined"
              type="text"
              name="cellphone"
              id="cellphone"
              label="Cellphone"
              placeholder="Insert Cellphone"
              size="medium"
              margin="normal"
              fullWidth
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
              autoFocus
              autoComplete="cellphone"
            />
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
              placeholder="Insert password"
              size="medium"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <FormControlLabel
              control={<Checkbox color="primary" checked={acceptTerms} onChange={() => setAcceptTerms(!acceptTerms)} />}
              label={
                <Typography variant="body1">
                  Accept our <b>terms and conditions </b>
                </Typography>
              }
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
              Sign Up
            </Button>
          </div>
          <div className={"yaTienesCuentaContainer"}>
            <span>You already have an account? </span>
            <Link to="/login" className={"registrate"}>
              <b className={"registrate"}>Log In</b>
            </Link>
          </div>
        </form>
      </div>

      <div className="mitad-derecha" style={{ flex: '1', backgroundColor: '#e0e0e0', padding: '20px' }}>
        <img
          src="./inventory3.jpg"
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
        {/* <Typography variant="h6" align="center" style={{ lineHeight: '1.5em', marginTop: '50px', fontFamily: 'Roboto, sans-serif', color: '#333', fontWeight: 'bold', fontSize: '14px' }}>
          Register today to enjoy exclusive features, personalized services, and seamless connectivity for a more efficient management experience
        </Typography> */}

        {/* <Typography align="center" style={{ lineHeight: '1.5em' }}>
          Register today to enjoy exclusive features, personalized services, and seamless connectivity for a more efficient management experience

        </Typography> */}

        {/* <Typography variant="h6" align="center" style={{ lineHeight: '1.5em', marginTop: '50px', fontFamily: 'Roboto, sans-serif', color: '#333', fontSize: '14px' }}>
          <b>Welcome</b>, we want that you use <b>Inv</b> for your business to obtain the best results.
          To start to use our web app, complete the next register form!
        </Typography> */}

        <Typography variant="h6" align="center" style={{ lineHeight: '1.5em', marginTop: '50px', fontFamily: 'Roboto, sans-serif', color: '#333', fontSize: '14px' }}>
          <b> Sign Up</b> today to enjoy exclusive features, personalized services, and seamless connectivity for a more efficient management experience
        </Typography>

      </div>
    </div>
  );
};

export default Register;
