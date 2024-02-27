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
  Autocomplete,
  IconButton,
  DialogActions,
  CircularProgress,
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
import { useUpdateInvoiceMutation } from '../slices/invoicesApiSlice';
//import { useUpdateRegisterMutation } from '../slices/registerApiSlice';
import { useGetProductsByUserIdQuery } from '../slices/productApiSlice'; // Import the hook
//import { useAddProductMutation, useDeleteProductMutation } from '../slices/productApiSlice';
import { useAddProductInvoiceMutation } from '../slices/productInvoicesApiSlice';
import { useGetGenerateIdInvoiceQuery } from '../slices/invoicesApiSlice';
import { useGetProductsByUserIdInvoiceQuery } from '../slices/productInvoicesApiSlice';
import { useUpdateProductAmountMutation } from '../slices/productApiSlice';


import dayjs from 'dayjs';
import 'dayjs/locale/es';


interface Product {
  id: string;
  productId: number;
  name: string;
  description: string;
  price: number;
  amount: number;
  dateIssue: string;
  utility: number;
}


interface TableConfigProps {
  userId: string;
  title: string;
  data: {
    id: string;
    subtype: string;
  }[];
  typevalue: string;
  addInvoiceMutation: any;
  token: string;
  updateData: (newData: any, dataType: string) => void;
  refetch: () => void;
  itemToUpdate: any;
  setOpenDialog: any;

}

const TableAddBilling: FunctionComponent<TableConfigProps> = ({
  userId,
  title,
  data,
  typevalue,
  addInvoiceMutation,
  token,
  updateData,
  refetch,
  itemToUpdate,
  setOpenDialog
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubtype, setNewSubtype] = useState("");
  const [originalSubtype, setOriginalSubtype] = useState("");
  const [addNewSubtype, setAddNewSubtype] = useState("");
  const [isNumericKeyboardOpen, setIsNumericKeyboardOpen] = useState(true);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [addProductInvoiceMutation] = useAddProductInvoiceMutation();
  const [updateProductAmount] = useUpdateProductAmountMutation();


  const [descRegistro, setDescRegistro] = useState(
    itemToUpdate && typevalue === "View" ? itemToUpdate.descRegistro : ""
  );

  const [subTotal, setSubTotal] = useState(
    itemToUpdate && typevalue === "View" ? itemToUpdate.subTotal : 0
  );

  const [dateIssue, setDateIssue] = useState(
    itemToUpdate && typevalue === "View" ? formatDate(itemToUpdate.dateIssue) : ""
  );

  const [taxes, setTaxes] = useState(
    itemToUpdate && typevalue === "View" ? itemToUpdate.taxes : ""
  );

  const [invoiceID, setInvoiceID] = useState(
    itemToUpdate && typevalue === "View" ? itemToUpdate.invoiceID : ""
  );

  //venta
  const [customer, setCustomer] = useState(
    itemToUpdate && typevalue === "View" ? itemToUpdate.customer : ""
  );

  const [paymentSell, setPaymentSell] = useState(
    itemToUpdate && typevalue === "View" ? itemToUpdate.paymentSell : ""
  );

  //compra
  const [provider, setProvider] = useState(
    itemToUpdate && typevalue === "View" ? itemToUpdate.provider : ""
  );
  const [paymentBuy, setPaymentBuy] = useState(
    itemToUpdate && typevalue === "View" ? itemToUpdate.paymentBuy : ""
  );

  const paymentSellOptions = ['efectivo', 'tarjeta de crédito', 'tarjeta de débito', 'cheque', 'pago en línea'];
  const [invoiceId, setInvoiceId] = useState(
    itemToUpdate && typevalue === "View" ? itemToUpdate.invoiceID : ""
  );

  //search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    invoiceID: number;
    invoiceType: string;
    productId: number;
    name: string;
    description: string;
    utility: number;
    price: number;
    amount: number;
    dateIssue: string;
  }>>([]);
  const [selectedProduct, setSelectedProduct] = useState<{
    invoiceID: number;
    invoiceType: string;
    productId: number;
    name: string;
    description: string;
    utility: number;
    price: number;
    amount: number;
    dateIssue: string;
  } | null>(null);
  const [confirmAddDialogOpen, setConfirmAddDialogOpen] = useState(false);
  // filtro invoiceId y productsinvoices
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [invalidationKey, setInvalidationKey] = useState<number>(0); // Estado para la clave de invalidación

  const [editableAmount, setEditableAmount] = useState('');
  const [productAmounts, setProductAmounts] = useState<{ [productId: number]: number }>({});
  const [searchResultsUpdated, setSearchResultsUpdated] = useState<Array<{
    invoiceID: number;
    invoiceType: string;
    productId: number;
    name: string;
    description: string;
    utility: number;
    price: number;
    amount: number;
  }>>([]);

  const { data: dataResponseRegisters, isLoading } = useGetProductsByUserIdQuery({
    data: {
      idUsuario: userId
    },
    token: token,
  });
  const { data: dataProductsInvoicesRegisters, refetch: customRefetch } = useGetProductsByUserIdInvoiceQuery({
    data: {
      idUsuario: userId
    },
    token: token,
  });

  const { data: generateIdData, error: generateIdError, refetch: generateIdRefetch } = useGetGenerateIdInvoiceQuery({
    data: { invoiceId: typevalue },
    token: token
  });

  useEffect(() => {
    if (itemToUpdate && typevalue === "View") {
      const { descRegistro, subTotal, dateIssue, taxes, invoiceID, customer, paymentSell, provider, paymentBuy } = itemToUpdate;

      setDescRegistro(descRegistro || "");
      setSubTotal(subTotal || "");
      setDateIssue(formatDate(dateIssue) || "");
      setTaxes(taxes || "");
      setInvoiceID(invoiceID || "");
      setCustomer(customer || "");
      setPaymentSell(paymentSell || "");
      setProvider(provider || "");
      setPaymentBuy(paymentBuy || "");
    } else {
      setDescRegistro("");
      setSubTotal("");
      setDateIssue("");
      setTaxes("");
      setInvoiceID("");
      setCustomer("");
      setPaymentSell("");
      setProvider("");
      setPaymentBuy("");
    }
  }, [itemToUpdate, typevalue]);

  useEffect(() => {
    console.log("itemToUpdate ha cambiado en TableAddRegister:", itemToUpdate);
  }, [itemToUpdate]);

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

  useEffect(() => {
    console.log("dataResponseRegisters");
    console.log(dataResponseRegisters)
    if (dataResponseRegisters) {
    }
  }, [dataResponseRegisters]);

  useEffect(() => {
    console.log(generateIdData);
    if (generateIdData) {
      console.log("InvoiceId");
      console.log(typeof invoiceId);
      console.log("generateIdData.sequence_value:");
      console.log(typeof generateIdData.sequence_value);
      setInvoiceId(generateIdData.sequence_value);
      console.log("valor de InvoiceId:");
      console.log(invoiceId);
    }
  }, [generateIdData]);

  if (generateIdError) {
    console.error('Error obteniendo el ID generado:', generateIdError);
  }

  useEffect(() => {
    if (typevalue === 'View') {
      console.log("en useEffect");
      if (dataProductsInvoicesRegisters) {
        console.log("invoiceID en dataProductsInvoicesRegisters");
        console.log(invoiceID);
        const dataInvoiceIdProducts = dataProductsInvoicesRegisters.filter((item: { invoiceID: any; }) => item.invoiceID === invoiceID);
        setFilteredData(dataInvoiceIdProducts);
      }
    } else {
      setFilteredData([]);
    }
  }, [typevalue, invoiceID, dataProductsInvoicesRegisters, searchResults, refetch]);

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0); // Forzar la zona horaria a UTC
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const calculateTotal = async () => {
    try {
      let totalSum = 0;
      for (const product of searchResultsUpdated) {
        console.log('FOR - product:');
        console.log(product);
        let multiplicationResult = 0;
        if (typevalue === 'Sales') {
          multiplicationResult = (product.price + (product.price * (product.utility / 100))) * product.amount;
        } else if (typevalue === 'Purchase') {
          multiplicationResult = product.price * product.amount;
        } else {
          console.error('Tipo de valor no reconocido');
        }
        if (!isNaN(multiplicationResult)) {
          totalSum += multiplicationResult;
        }
      }
      return totalSum;
    } catch (error) {
      console.error('Error al calcular el total:', error);
      throw error;
    }
  };

  const handleAdd = async () => {
    if (!dateIssue) {
      if (!dateIssue) {
        toast.error("Debes seleccionar una dateIssue válida.");
      }
      return;
    }
    try {
      //await handleConfirmAll();      
      const totalSum = await calculateTotal();

      setInvoiceId(generateIdData.sequence_value);
      console.log("en addInvoiceMutation invoiceID"); // prioblema asíncrono!!
      console.log(invoiceID);

      const response = await addInvoiceMutation({
        registro: {
          //Mandatory fields
          // invoiceID: invoiceID,
          invoiceID: generateIdData.sequence_value,
          invoiceType: typevalue,
          dateIssue: dateIssue,
          // subTotal: subTotal,
          subTotal: totalSum,
          // taxes: totalSum*0.19,
          taxes: (totalSum * 0.19).toFixed(0),
          //compra
          customer: customer,
          paymentSell: paymentSell,
          //venta
          provider: provider,
          paymentBuy: paymentBuy,
          idUsuario: userId
        },
        token: token,
      });

      console.log("data:");
      console.log(data);

      generateIdRefetch(); //test
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

  const handleNumericButtonClick = (number: number) => {
    setSubTotal((prevValue: string) => prevValue + number.toString());
  };



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

    if (!dateIssue || !descRegistro) {

      if (!dateIssue) {
        toast.error("Debes seleccionar una dateIssue válida.");
      }
      if (!descRegistro) {
        toast.error("Debes seleccionar un tipo.");
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
      if (!itemToUpdate) {
        console.error("Elemento no encontrado para actualizar");
        return;
      }

      console.log("en handle edit invoiceID");
      console.log(invoiceID);

      const updatedItem = {
        invoiceID: invoiceID,
        invoiceType: typevalue,
        dateIssue: dateIssue,
        //idUsuario: idUsuario,
        subTotal: subTotal,
        taxes: taxes,

        customer: customer,
        paymentSell: paymentSell,
        //venta
        provider: provider,
        paymentBuy: paymentBuy,

      };
      await updateInvoice(
        {
          // id: itemToUpdate._id,  //nodejs
          id: itemToUpdate.id,    //spring boot      
          registro: updatedItem,
          token: token
        }
      );
      refetch();
    } catch (error) {
      console.error("Error al editar el registro:", error);
    }
  };



  const handlePaymentSellChange = (event: { target: { value: any; }; }) => {
    setPaymentSell(event.target.value);
  };

  const handlePaymentBuyChange = (event: { target: { value: any; }; }) => {
    setPaymentBuy(event.target.value);
  };



  const handleSearch = () => {
    const filteredResults = dataResponseRegisters.filter(
      (product: { name: string; productId: number; }) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productId.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  const handleCreateInvoice = () => {
    setConfirmAddDialogOpen(true);
  };

  const confirmAddToCart = () => {
    console.log('selectedProduct');
    console.log(selectedProduct);

    setProductAmounts((prevAmounts) => {
      const updatedAmounts = { ...prevAmounts };
      updatedAmounts[selectedProduct!.productId] = Number(editableAmount);
      return updatedAmounts;
    });

    setSearchResults([...searchResults, selectedProduct!]);
    setSelectedProduct(null);
    setSearchTerm('');
    setConfirmAddDialogOpen(false);
  };

  const cancelAddToCart = () => {
    setConfirmAddDialogOpen(false);
  };

  const handleDeleteFromList = (productIdToDelete: number) => {
    console.log('Deleting product with ID:', productIdToDelete);
    console.log('Previous results:', searchResults);

    setSearchResults((prevResults) => {
      const newResults = prevResults.filter((product) => product.productId !== productIdToDelete);
      console.log('New results:', newResults);
      return newResults;
    });
  };

  const handleConfirmAll = async () => {
    try {
      for (const originalProduct of searchResults) {
        const product = { ...originalProduct };
        product.invoiceID = generateIdData.sequence_value;
        product.invoiceType = typevalue;
        product.amount = productAmounts[product.productId]; // Ensure amount is provided
        product.dateIssue = dateIssue;
        // product.utility = product.utility;
        console.log("product");
        console.log(product);
        // registro productinvoice
        const response = await addProductInvoiceMutation({
          registro: product,
          token: token,
        });
        console.log('Respuesta de la inserción:', response);
        handleForceReload();
        searchResultsUpdated.push(product);
        //generateIdRefetch();
      }
      console.log('searchResultsUpdated');
      console.log(searchResultsUpdated);
      setSearchResults([]);
      toast.success('Se ha emitido la factura correctamente con los datos proporcionados');
    } catch (error) {
      console.error('Error al confirmar los productos:', error);
      toast.error('Hubo un error al confirmar los productos');
    }
  };

  const handleAmountChange = (productId: number, newValue: number) => {
    setProductAmounts((prevAmounts) => ({
      ...prevAmounts,
      [productId]: newValue,
    }));
  };

  const handleEditAmount = (productId: number) => {
    const updatedAmount = productAmounts[productId];
    console.log(`Product ${productId} amount updated to ${updatedAmount}`);
  };

  // Función para forzar la recarga de datos
  const handleForceReload = () => {
    setInvalidationKey((prevKey) => prevKey + 1);
    customRefetch(); // Llama a la función de refetch aquí
  };

  const isAutocompleteDisabled = typevalue === 'View';
  //
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    //if (!dateIssue || !provider || !paymentBuy || !customer || !paymentSell) {
    if (!dateIssue || (!provider && !paymentBuy) || (!customer && !paymentSell)) {
      if (!dateIssue) {
        toast.error("Debes seleccionar una dateIssue válida.");
        return;
      }

      if (typevalue == "Purchase") {
        if (!provider) {
          toast.error("Debes ingresar una provider válido.");
          return;
        }
        if (!paymentBuy) {
          toast.error("Debes ingresar una paymentBuy válida.");
          return;
        }
      }
      if (typevalue == "Sales") {
        if (!customer) {
          toast.error("Debes ingresar una customer válido.");
          return;
        }
        if (!paymentSell) {
          toast.error("Debes ingresar una paymentSell válida.");
          return;
        }
      }

      if (searchResults.length === 0) {
        toast.error("Debes agregar productos a la lista.");
        return;
      }
    }

    try {
      // Iniciar el estado de carga
      setLoading(true);
      // Primero ejecutar handleConfirmAll
      await handleConfirmAll();
      // Luego ejecutar handleAdd
      await handleAdd();
      // Desactivar el estado de carga
      setLoading(false);
      // Cerrar los diálogos
      setOpenDialog(false);
      setConfirmAddDialogOpen(false);
    } catch (error) {
      console.error("Error:", error);
      // Manejar el error aquí y desactivar el estado de carga
      setLoading(false);
    }
  };

  const isReadOnly = typevalue === 'View';

  return (
    <form onSubmit={handleAdd}>
      <div>
        <Typography variant="h6" gutterBottom>
          {/* Add {title}   {title} Invoice      {/* {itemToUpdate.invoiceType} Invoice //new invoice */}
          {itemToUpdate ? itemToUpdate.invoiceType + ' Invoice' : `${title} Invoice`}
        </Typography>
        <br />

        <Grid container spacing={2}>
          {/* <Grid item xs={12} style={{ width: '50%' }}>
            <TextField
              label="Invoice ID"
              variant="outlined"
              type="text"
              value={invoiceId || ""}
              fullWidth
              onChange={(e) => setInvoiceId(e.target.value)}
            />
          </Grid> */}

          <Grid item xs={6} style={{ width: '50%' }}>
            {/* <TextField
              label="Invoice ID"
              variant="outlined"
              type="text"
              value={invoiceId}
              fullWidth
              onChange={(e) => setInvoiceId(e.target.value)}
              InputProps={{
                readOnly: true, // Hace que el campo sea de solo lectura
              }}
            /> */}

            <TextField
              label="Invoice ID"
              variant="outlined"
              type="text"
              value={invoiceId}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          {/* DatePicker */}
          <Grid item xs={6} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={dayjs(dateIssue)}
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setDateIssue(newValue.format('MM-DD-YYYY'));
                    //setFecha(newValue.format('YYYY-MM-DD'));
                  }
                }}
                disabled={isReadOnly}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            {(typevalue === 'Purchase' || (itemToUpdate && (typevalue === 'View' && itemToUpdate.invoiceType === 'Purchase'))) && (
              <TextField
                label="Provider"
                variant="outlined"
                type="text"
                value={provider || ""}
                fullWidth
                onChange={(e) => setProvider(e.target.value)}
                InputProps={{
                  readOnly: isReadOnly,
                }}
              />
            )}
          </Grid>

          <Grid item xs={6}>
            {(typevalue === 'Purchase' || (itemToUpdate && (typevalue === 'View' && itemToUpdate.invoiceType === 'Purchase'))) && (
              <FormControl fullWidth>
                <InputLabel id="paymentSell-label">Payment Buy</InputLabel>
                <Select
                  labelId="paymentSell-label"
                  id="paymentSell"
                  value={paymentBuy}
                  onChange={handlePaymentBuyChange}
                  label="Payment Buy"
                  inputProps={{
                    readOnly: isReadOnly, // Utiliza inputProps para aplicar readOnly
                  }}
                >
                  {paymentSellOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>

          <Grid item xs={6}>
            {(typevalue === 'Sales' || (itemToUpdate && (typevalue === 'View' && itemToUpdate.invoiceType === 'Sales'))) && (
              <TextField
                label="Customer"
                variant="outlined"
                type="text"
                value={customer || ""}
                fullWidth
                onChange={(e) => setCustomer(e.target.value)}
                InputProps={{
                  readOnly: isReadOnly,
                }}
              />
            )}
          </Grid>

          <Grid item xs={6}>
            {(typevalue === 'Sales' || (itemToUpdate && (typevalue === 'View' && itemToUpdate.invoiceType === 'Sales'))) && (
              <FormControl fullWidth>
                <InputLabel id="paymentSell-label">Payment Sell</InputLabel>
                <Select
                  labelId="paymentSell-label"
                  id="paymentSell"
                  value={paymentSell}
                  onChange={handlePaymentSellChange}
                  label="Payment Sell"
                  inputProps={{
                    readOnly: isReadOnly, // Utiliza inputProps para aplicar readOnly
                  }}
                >
                  {paymentSellOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>

          {/* <Grid item xs={6}>
            <TextField
              label="Taxes"
              variant="outlined"
              type="text"
              value={taxes || ""}
              fullWidth
              onChange={(e) => setTaxes(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Sub Total"
              variant="outlined"
              type="text"
              value={subTotal || ""}
              fullWidth
              onChange={(e) => setSubTotal(e.target.value)}
            />
          </Grid> */}
          {typevalue === 'View' && (
            <>
              {/* Muestra los campos solo cuando typevalue es 'View' */}
              <Grid item xs={6}>
                <TextField
                  label="Taxes"
                  variant="outlined"
                  type="text"
                  value={taxes || ""}
                  fullWidth
                  onChange={(e) => setTaxes(e.target.value)}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Sub Total"
                  variant="outlined"
                  type="text"
                  value={subTotal || ""}
                  fullWidth
                  onChange={(e) => setSubTotal(e.target.value)}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                />
              </Grid>
            </>
          )}

          {/* <Grid item xs={6}>
            {addButton}
          </Grid> */}

        </Grid>
      </div>

      {/* <div>
        <TextField
          label="Search by Name or ProductID"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div> */}

      <br />

      <Autocomplete
        options={dataResponseRegisters}
        getOptionLabel={(option) => option.description}
        value={selectedProduct}
        onChange={(_, newValue) => setSelectedProduct(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search product by description"
            variant="outlined"
            fullWidth
            //value={searchTerm}
            value={typevalue === 'View' ? null : selectedProduct}
            onChange={(e) => setSearchTerm(e.target.value)}
            //onChange={(e) => setSearchResults(e.target.value)}
            //disabled={isAutocompleteDisabled}
            style={{ display: isAutocompleteDisabled ? 'none' : 'block' }}
          />
        )}
      />
      {/* <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button> */}
      <br />


      {/* <Button variant="contained" color="primary" onClick={handleAddToList} disabled={!selectedProduct}> */}
      <Button variant="contained" color="primary" onClick={confirmAddToCart} disabled={!selectedProduct}
        style={{ display: isAutocompleteDisabled ? 'none' : 'block' }}
      >
        Add to List
      </Button>
      <br />
      <div style={{ marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Product list
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Product ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {typevalue === 'View'
                ? filteredData.map((product) => (
                  // <TableRow key={product.productId}>
                  <TableRow key={product.id}>  
                    <TableCell>{product.productId}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.amount}</TableCell>
                    <TableCell>{/* Acciones específicas para View, si es necesario */}</TableCell>
                  </TableRow>
                ))
                : searchResults.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>{product.productId}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={productAmounts[Number(product.productId)] || 0}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          // Ensure newValue is a valid number before passing it to handleAmountChange
                          const numericValue = isNaN(Number(newValue)) ? 0 : Number(newValue);
                          handleAmountChange(product.productId, numericValue);
                        }}
                        onBlur={() => handleEditAmount(product.productId)}
                        inputProps={{ min: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteFromList(product.productId)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Button
        variant="contained"
        color="primary"
        // onClick={() => {
        //   handleAdd();
        //   //handleAddToList();
        //   handleConfirmAll();
        // }}

        onClick={() => {
          // handleAddToList
          handleCreateInvoice()
        }}

        fullWidth
        sx={{ marginTop: 2 }}
      //disabled={!selectedProduct}
      >
        Generar Factura
      </Button>

      <Dialog open={confirmAddDialogOpen} onClose={cancelAddToCart}>
        <DialogTitle>Confirm Add to List</DialogTitle>
        <DialogContent>
          Confirmas que todos los datos son correctos, para la Nueva Factura?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAddToCart} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClick} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>

        </DialogActions>
      </Dialog>
    </form>
  );
};

export default TableAddBilling;
