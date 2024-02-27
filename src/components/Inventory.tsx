// import React, { FunctionComponent, useEffect, useState } from "react";
// import { toast } from 'react-toastify';
// import { Typography, TextField, Button } from '@mui/material';


// const Inventory: FunctionComponent = () => {

//     return (
//         <div className="contenedor" style={{ display: 'flex' }}>
//             <div className="mitad-izquierda" style={{ flex: '1' }}>

//                 <form className={"form"} style={{ width: '100%' }}>
//                     <Typography variant="h5" align="center" gutterBottom>
//                     Inventory
//                     </Typography>

//                     <div className="form-elements-container">

//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Inventory;

import React, { FunctionComponent, useState, useEffect } from "react";
import {
    Container,
    CssBaseline,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    TextField,
    Fab,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaidIcon from "@mui/icons-material/Paid";
//import { useGetTypeValuesByUserIdQuery } from '../slices/typeValuesApiSlice';
import { useSelector } from "react-redux";
import TableAddRegister from "./TableAddRegister";

import { Box, IconButton, Tab, Tabs } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

//tabla registros
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

//import { useGetRegistersByCriteriaQuery } from '../slices/registerApiSlice'; // Import the hook
import { useGetProductsByUserIdQuery } from '../slices/productApiSlice'; // Import the hook

//import { useAddRegisterMutation, useDeleteRegisterMutation } from '../slices/registerApiSlice';
import { useAddProductMutation, useDeleteProductMutation } from '../slices/productApiSlice';
import { CircularProgress } from "@mui/material";
import PostAddIcon from '@mui/icons-material/PostAdd';

function filterRecordsByMonthAndYear(records: any[], targetMonth: number, targetYear: number) {
    return records.filter((record: { fecha: string | number | Date; }) => {
        const recordDate = new Date(record.fecha);
        const recordMonth = recordDate.getMonth();
        const recordYear = recordDate.getFullYear();
        return recordMonth === targetMonth && recordYear === targetYear;
    });
}

type Record = {
    id: string;
    tipoRegistro: string;
    descRegistro: string;
    fecha: string;
    monto: number;
    // Otros campos de tus registros
};



const Inventory: FunctionComponent = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [spentData, setSpentData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [numericValue, setNumericValue] = useState("");
    const [addTypeValueMutation] = useAddProductMutation();
    const [deleteTypeValueMutation] = useDeleteProductMutation();
    const [rowId, setrowId] = useState("");
    const [dataEdit, setDataEdit] = useState([]);
    const [itemToUpdate, setItemToUpdate] = useState("");
    //const [filteredRecords, setFilteredRecords] = useState([]);
    //const [filtered, setFiltered] = useState<Record[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);

    // useEffect(() => {
    //     //console.log("itemToUpdate ha cambiado:", itemToUpdate);  
    // }, [itemToUpdate]);

    const userId = useSelector((state: any) => state.auth.userInfo._id);
    // console.log("userId");
    // console.log(userId);
    const token = useSelector((state: any) => state.auth.token);

    // const { data: dataResponse } = useGetTypeValuesByUserIdQuery({
    //     idUsuario: userId,
    //     token: token,
    // });


    // console.log("userInfo");
    // console.log(useSelector((state: any) => state.auth.userInfo.id));
    const { data: dataResponseRegisters, isLoading, refetch } = useGetProductsByUserIdQuery({
        data: {
            idUsuario: userId
        },
        token: token,
    });
    // useEffect(() => {
    //     if (dataResponseRegisters) {
    //     }
    // }, [dataResponseRegisters]);

    // useEffect(() => {
    //     refetch();
    // }, [userId, token]);
    useEffect(() => {
        refetch();
    }, [dataResponseRegisters]);

    // useEffect(() => {
    //     if (dataResponse) {
    //         const spentDataMapped = dataResponse
    //             .filter((item: { typevalue: string; }) => item.typevalue === 'Spent')
    //             .map((item: { id: string; subtype: any; }) => ({
    //                 id: item.id,
    //                 subtype: item.subtype
    //             }));

    //         const incomeDataMapped = dataResponse
    //             .filter((item: { typevalue: string; }) => item.typevalue === 'Income')
    //             .map((item: { id: string; subtype: any; }) => ({
    //                 id: item.id,
    //                 subtype: item.subtype
    //             }));

    //         setSpentData(spentDataMapped);
    //         setIncomeData(incomeDataMapped);
    //     }
    // }, [dataResponse]);

    const handleClickOpen = (title: string) => {
        setDialogTitle(title);
        setOpenDialog(true);
        setNumericValue("");
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const updateData = (newData: any, dataType: any) => {
        if (dataType === "Spent") {
            setSpentData(newData);
        } else if (dataType === "Income") {
            setIncomeData(newData);
        }
    };

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    //dialog tabla regs
    const [open, setOpen] = useState(false);

    const handleClickOpenRegisters = () => {
        refetch();
        setOpen(true);
    };

    const handleCloseRegisters = () => {
        setOpen(false);
        refetch();
    };

    const handleDelete = async (id: string) => {
        try {
            //await deleteTypeValueMutation(id);
            await deleteTypeValueMutation(
                {
                    registro: {
                        id: id
                    },
                    token: token
                }
            );

            refetch(); // Refrescar los datos desde la consulta
        } catch (error) {
            console.error("Error al eliminar el valor:", error);
        }
    };

    // const handleEdit = async (title: string, rowId: string) => {
    //     setDialogTitle(title);
    //     setOpenDialog(true);
    //     setrowId(rowId);
    //     const itemToUpdate = dataResponseRegisters.find((item: { id: string; }) => item.id === rowId);
    //     console.log("Add register itemToUpdate: ");
    //     console.log(itemToUpdate);
    //     setItemToUpdate(itemToUpdate);
    //     const dataEdit =
    //         itemToUpdate.tipoRegistro === "Spent" ? spentData :
    //             itemToUpdate.tipoRegistro === "Income" ? incomeData :
    //                 [];      
    //     refetch();
    // };

    // const handleEdit = async (title: string, rowId: string) => {
    //     setDialogTitle(title);
    //     setOpenDialog(true);
    //     setrowId(rowId);

    //     try {
    //         const itemToUpdate = dataResponseRegisters.find((item: { id: string; }) => item.id === rowId);
    //         setItemToUpdate(itemToUpdate);

    //         // Refrescar los datos antes de acceder a dataResponseRegisters
    //         await refetch();
    //         console.log("Data refetched successfully.");

    //         const dataEdit =
    //             itemToUpdate.tipoRegistro === "Spent" ? spentData :
    //                 itemToUpdate.tipoRegistro === "Income" ? incomeData :
    //                     [];
    //         console.log("dataEdit: ");
    //         console.log(dataEdit);
    //     } catch (error) {
    //         console.error("Error al manejar la edición:", error);
    //     }
    // };

    const handleEdit = (title: string, rowId: string) => {
        setDialogTitle(title);
        setOpenDialog(true);
        setrowId(rowId);

        const itemToUpdate = dataResponseRegisters.find((item: { id: string; }) => item.id === rowId);  //nodejs
        // const itemToUpdate = dataResponseRegisters.find((item: { id: string; }) => item.id === rowId); //spring boot

        setItemToUpdate(itemToUpdate);

        // Pasa la función refetch al componente hijo
        const refetchFunction = async () => {
            await refetch();
            console.log("Data refetched successfully.");
        };

        // const dataEdit =
        //     itemToUpdate.tipoRegistro === "Spent" ? spentData :
        //         itemToUpdate.tipoRegistro === "Income" ? incomeData :
        //             [];

        // Pasa la función refetch al componente hijo
        // setDataEdit({ dataEdit, refetchFunction });
    };

    useEffect(() => {
        if (dataResponseRegisters) {
            const filtered = filterRecordsByMonthAndYear(dataResponseRegisters, currentMonth, currentYear);
            setFilteredRecords(filtered);
        }
    }, [dataResponseRegisters, currentMonth, currentYear]);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 10);
    }, []);

    return (
        //<Container component="main" maxWidth="xs" sx={{ marginTop: 10, height: '540.5px' }}>
        <Container component="main" maxWidth="md" className={`fade-in-vertical ${isVisible ? 'active' : ''} common-styles  component-container`}>
            <CssBaseline />
            <div>
                <Typography variant="h5" align="center" gutterBottom>
                    Inventory
                </Typography>

                <form className={"form"}>
                    {/* <div className={"buttonsContainer"}> */}
                    {/* <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleClickOpen("Spent")}
                            startIcon={<ShoppingCartIcon />}
                        >
                            New Spent
                        </Button>  */}

                    {/* <Fab
                            color="primary"
                            onClick={() => handleClickOpen("Spent")}
                        >
                            <PostAddIcon />
                        </Fab>
                    </div> */}
                    <div className="buttonsContainer" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Fab
                            color="primary"
                            onClick={() => handleClickOpen("Spent")}
                        >
                            <Typography variant="body2" style={{ fontSize: '0.65rem', marginRight: '5px' }}> New</Typography>
                            <PostAddIcon />
                        </Fab>
                    </div>

                    <Dialog
                        open={openDialog}
                        TransitionComponent={Slide}
                        keepMounted
                        onClose={handleClose}
                        maxWidth="xs"
                        fullWidth
                    >

                        {/* <DialogTitle>{dialogTitle}</DialogTitle> */}

                        {/* <DialogContent style={{ maxHeight: 400, overflowY: 'scroll' }}> */}
                        <DialogContent style={{ maxHeight: 400, overflowY: 'scroll' }}>
                            {dialogTitle === "Spent" && (
                                <TableAddRegister
                                    userId={userId}
                                    title={dialogTitle}
                                    typevalue="Spent"
                                    data={spentData}
                                    addTypeValueMutation={addTypeValueMutation}
                                    token={token}
                                    updateData={updateData}
                                    refetch={refetch}
                                    itemToUpdate={null}
                                />
                            )}
                            {dialogTitle === "Income" && (
                                <TableAddRegister
                                    userId={userId}
                                    title={dialogTitle}
                                    typevalue="Income"
                                    data={incomeData}
                                    addTypeValueMutation={addTypeValueMutation}
                                    token={token}
                                    updateData={updateData}
                                    refetch={refetch}
                                    itemToUpdate={null}
                                />
                            )}

                            {dialogTitle === "Edit Register" && (
                                <TableAddRegister
                                    userId={userId}
                                    title={dialogTitle}
                                    typevalue="Edit Register"
                                    data={dataEdit || []}
                                    //dataRegisters= {dataResponseRegisters}
                                    addTypeValueMutation={addTypeValueMutation}
                                    token={token}
                                    updateData={updateData}
                                    refetch={refetch}
                                    itemToUpdate={itemToUpdate}
                                />
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cerrar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </form>

                <div>
                    {/* <TableContainer component={Paper} style={{ maxHeight: "70vh", width: "100%" }}> */}
                    <TableContainer  >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell>ID</TableCell> */}
                                    <TableCell sx={{ fontWeight: 'bold' }}>Product ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Utility</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}> </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {/* {filteredRecords.length > 0 ? (
                                    filteredRecords.map((row: any) => ( */}
                                {dataResponseRegisters && dataResponseRegisters.length > 0 ? (
                                    dataResponseRegisters.map((row: any) => (
                                        <TableRow key={row.id}>
                                            {/* <TableCell>{row.productId}</TableCell> */}
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.utility}</TableCell>
                                            <TableCell>{row.price}</TableCell>
                                            <TableCell>{row.amount}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="edit"
                                                    onClick={() => {
                                                        handleCloseRegisters();
                                                        handleEdit("Edit Register", row.id);
                                                        // handleEdit("Edit Register", row.productId);
                                                    }}
                                                >
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="delete"
                                                    //onClick={() => handleDelete(row.id)} //node js
                                                    onClick={() => handleDelete(row.id)} //spring boot
                                                >
                                                    <DeleteIcon color="secondary" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5}>No data available</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </Container>
    );
};

export default Inventory;

