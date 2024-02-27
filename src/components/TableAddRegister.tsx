import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
//import { useUpdateRegisterMutation } from '../slices/registerApiSlice';
import { useUpdateProductMutation } from '../slices/productApiSlice';
import { useUpdateProductAmountMutation } from '../slices/productApiSlice';



import dayjs from 'dayjs';
import 'dayjs/locale/es';

interface TableConfigProps {
  userId: string;
  title: string;
  data: {
    id: string;
    subtype: string;
  }[];
  typevalue: string;
  addTypeValueMutation: any;
  token: string;
  updateData: (newData: any, dataType: string) => void;
  refetch: () => void;
  itemToUpdate: any;

}

const TableAddRegister: FunctionComponent<TableConfigProps> = ({
  userId,
  title,
  data,
  typevalue,
  addTypeValueMutation,
  token,
  updateData,
  refetch,
  itemToUpdate
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubtype, setNewSubtype] = useState("");
  const [originalSubtype, setOriginalSubtype] = useState("");
  const [addNewSubtype, setAddNewSubtype] = useState("");
  const [isNumericKeyboardOpen, setIsNumericKeyboardOpen] = useState(true);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [updateTypeValue] = useUpdateProductMutation();
  //const [updateTypeValue] = useUpdateProductAmountMutation();


  useEffect(() => {
    // Este bloque de código se ejecutará cuando itemToUpdate cambie
    console.log("itemToUpdate ha cambiado en TableAddRegister:", itemToUpdate);

    // Realiza las acciones necesarias basadas en el cambio de itemToUpdate
  }, [itemToUpdate]);

  const [name, setName] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.name : ""
  );

  const [description, setDescription] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.description : ""
  );

  const [utility, setUtility] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.utility : 0
  );

  const [price, setPrice] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.price : 0
  );

  const [amount, setAmount] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.amount : 0
  );


  // const [monto, setMonto] = useState(
  //   itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.monto : ""
  // );
  // const [fecha, setFecha] = useState(
  //   itemToUpdate && typevalue === "Edit Register" ? formatDate(itemToUpdate.fecha) : ""
  // );

  useEffect(() => {
    if (itemToUpdate && typevalue === "Edit Register") {
      setName(itemToUpdate.name);
      setDescription(itemToUpdate.description);
      setUtility(itemToUpdate.utility);
      setPrice(itemToUpdate.price);
      setAmount(itemToUpdate.amount);
      // setDescRegistro(itemToUpdate.descRegistro);
      // setMonto(itemToUpdate.monto);
      // setFecha(formatDate(itemToUpdate.fecha));
    } else {
      // En caso de que itemToUpdate sea null u otra condición, puedes establecer los estados en un valor predeterminado

      setDescription("");
      setAmount("");
      // setMonto("");
      // setFecha("");
    }
  }, [itemToUpdate, typevalue]);

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0); // Forzar la zona horaria a UTC
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
    // return `${day}/${month}/${year}`;
  }

  // const handleEdit = (id: string) => {
  //   setEditingId(id);
  //   const currentItem = data.find((item) => item.id === id);
  //   if (currentItem) {
  //     setNewSubtype(currentItem.subtype);
  //     setOriginalSubtype(currentItem.subtype);
  //   }
  // };

  const handleAdd = async () => {
    if (!description || !amount) {
      if (!description || !amount) {
        toast.error("El campo de valor numérico es obligatorio.");
      }
      if (!amount) {
        toast.error("El campo de valor numérico es obligatorio.");
      }
      return;
    }

    try {
      const response = await addTypeValueMutation({
        registro: {
          name: name,
          description: description,
          price: price,
          amount: amount,
          utility: utility,
          idUsuario: userId
        },
        token: token,
      });

      const newId = response.data.id;
      const newItem = { id: newId, subtype: addNewSubtype, typevalue: typevalue };
      const updatedData = [...data, newItem];
      setAddNewSubtype("");
      updateData(updatedData, typevalue);
      refetch();
    } catch (error) {
      console.error("Error al agregar el nuevo valor:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewSubtype(originalSubtype);
  };

  const openNumericKeyboard = () => {
    setIsNumericKeyboardOpen(true);
  };

  const closeNumericKeyboard = () => {
    setIsNumericKeyboardOpen(false);
  };

  // const handleNumericButtonClick = (number: number) => {
  //   setMonto((prevValue: string) => prevValue + number.toString());
  // };

  useEffect(() => {
    if (!editingId) {
      setAddNewSubtype("");
    }
  }, [editingId]);

  useEffect(() => {
    if (editingId && tableRef.current) {
      const rowElement = tableRef.current.querySelector(`#row-${editingId}`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [editingId, tableRef]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (editingId) {
        //handleSave(editingId);
      } else {
        handleAdd();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (editingId) {
        handleCancelEdit();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!description || !amount) {
      if (!description) {
        toast.error("El campo de valor numérico es obligatorio.");
      }
      if (!description || !amount) {
        toast.error("El campo de valor numérico es obligatorio.");
      }

      return;
    }

    try {
      // ... (lógica de envío del formulario)
    } catch (error) {
      console.error("Error al agregar el nuevo valor:", error);
    }
  };

  const handleEdit = async () => {
    try {
      console.log("itemToUpdate");
      console.log(itemToUpdate);
      console.log(itemToUpdate.id);

      if (!itemToUpdate) {
        console.error("Elemento no encontrado para actualizar");
        return;
      }

      const updatedItem = {
        name: name,
        description: description,
        price: price,
        amount: amount,
        utility: utility
      };

      console.log("updatedItem:");
      console.log(updatedItem);
      console.log(itemToUpdate.id);

      await updateTypeValue(
        {
          id: itemToUpdate.id,
          registro: updatedItem,
          token: token
        }
      );

      refetch();
    } catch (error) {
      console.error("Error al editar el registro:", error);
    }
    // } else {
    //   // Realiza la adición de un nuevo registro
    //   // Resto del código para agregar un nuevo registro
    // }

  };



  let addButton = null;
  if (typevalue === "Spent" || typevalue === "Income") {
    addButton = (
      <Button
        variant="contained"
        name="iniciar"
        id="idIniciar"
        color="primary"
        onClick={handleAdd}
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Add
      </Button>
    );
  } else if (typevalue === "Edit Register") {
    addButton = (
      <Button
        variant="contained"
        name="iniciar"
        id="idIniciar"
        color="primary"
        onClick={handleEdit}
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Edit
      </Button>
    );
  }

  return (
    <form onSubmit={handleAdd}>
      <div>
        <Typography variant="h6" gutterBottom>
          {/* Add {title} */}
          New Register
        </Typography>

        <Grid container spacing={2}>
          {/* Numeric Value */}
          <Grid item xs={12}>
            {/* <TextField
              label="Numeric Value"
              variant="outlined"
              type="text"
              value={product || ""}
              fullWidth
            //onClick={openNumericKeyboard}
            //onKeyPress={handleKeyPress}
            /> */}
            <TextField
              label="Brand"
              variant="outlined"
              type="text" // o type="text"
              value={name || ""}
              onChange={(e) => setName(e.target.value)} // Asumiendo que estás utilizando un estado (useState)
              fullWidth
              style={{ marginBottom: '20px' }}
            />

            <br />
            <TextField
              label="Description"
              variant="outlined"
              type="text" // o type="text"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)} // Asumiendo que estás utilizando un estado (useState)
              fullWidth
              style={{ marginBottom: '20px' }}
            />

            <br />
            <TextField
              label="Utility %"
              variant="outlined"
              type="number"
              value={utility || 0}
              onChange={(e) => setUtility(e.target.value)} // Asumiendo que estás utilizando un estado (useState)
              fullWidth
              style={{ marginBottom: '20px' }}
            />

            <br />
            <TextField
              label="Price"
              variant="outlined"
              type="number"
              value={price || 0}
              onChange={(e) => setPrice(e.target.value)} // Asumiendo que estás utilizando un estado (useState)
              fullWidth
              style={{ marginBottom: '20px' }}
            />

            <br />
            <TextField
              label="Amount"
              variant="outlined"
              type="number"
              value={amount || 0}
              onChange={(e) => setAmount(e.target.value)} // Asumiendo que estás utilizando un estado (useState)
              fullWidth
            />

          </Grid>

          <Grid item xs={12}>
            {addButton}
          </Grid>

        </Grid>
      </div>
    </form>
  );
};

export default TableAddRegister;
