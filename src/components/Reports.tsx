import React, { FunctionComponent, useEffect, useState } from "react";
import { Container, CssBaseline, Typography, IconButton, Box, Tab, Tabs } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";
// import { useGetRegistersByCriteriaQuery } from "../slices/registerApiSlice";
// import { useGetInvoicesByUserIdQuery } from '../slices/invoicesApiSlice';
import { useGetProductsByUserIdInvoiceQuery } from '../slices/productInvoicesApiSlice';

import Switch from '@mui/material/Switch';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import { BarChart } from '@mui/x-charts/BarChart';

const Reports: FunctionComponent = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [filterByType, setFilterByType] = useState('Purchase');

    const userId = useSelector((state: any) => state.auth.userInfo._id);
    const token = useSelector((state: any) => state.auth.token);

    const { data: dataResponseRegisters } = useGetProductsByUserIdInvoiceQuery({
        data: {
            idUsuario: userId,
        },
        token: token,
    });

    //solo spring boot
    useEffect(() => {
        // console.log("dataResponseRegisters" + dataResponseRegisters + "  lenght: " + dataResponseRegisters.lenght);
        // console.log(dataResponseRegisters);
    }, [dataResponseRegisters]);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const years = Array.from({ length: 3 }, (_: any, i: number) => currentYear - 1 + i);

    const allDates = years.map((year: any) => months.map((month) => `${month} ${year}`)).flat();

    const handleNextDate = () => {
        const currentIndex = allDates.indexOf(`${months[currentMonth]} ${currentYear}`);
        if (currentIndex < allDates.length - 1) {
            const [selectedMonth, selectedYear] = allDates[currentIndex + 1].split(" ");
            setCurrentMonth(months.indexOf(selectedMonth));
            setCurrentYear(Number(selectedYear));
        }
    };

    const handlePreviousDate = () => {
        const currentIndex = allDates.indexOf(`${months[currentMonth]} ${currentYear}`);
        if (currentIndex > 0) {
            const [selectedMonth, selectedYear] = allDates[currentIndex - 1].split(" ");
            setCurrentMonth(months.indexOf(selectedMonth));
            setCurrentYear(Number(selectedYear));
        }
    };

    type Record = {
        totalSales: number;
        id: string;
        idUsuario: string;
        invoiceType: string;
        invoiceID: number;
        productId: number;
        name: string;
        description: string;
        price: number;
        amount: number;
        createdAt: string;
        updatedAt: string;
        utility: number;
    };

    function filterRecordsByMonthAndYear(records: any[], targetMonth: number, targetYear: number) {
        if (!records) {
            return [];
        }

        return records.filter((record) => {
            const recordDate = new Date(record.dateIssue);
            const recordMonth = recordDate.getMonth();
            const recordYear = recordDate.getFullYear();
            return recordMonth === targetMonth && recordYear === targetYear;
        });
    }

    const handleTabClick = (event: React.SyntheticEvent, newValue: number) => {
        const [selectedMonth, selectedYear] = allDates[newValue].split(" ");
        setCurrentMonth(months.indexOf(selectedMonth));
        setCurrentYear(Number(selectedYear));
    };

    let sumaDeValores = 0;
    if (dataResponseRegisters) {
        console.log('Reports - dataResponseRegisters:');
        console.log(dataResponseRegisters);

        sumaDeValores = dataResponseRegisters.reduce((total: any, item: { subTotal: any }) => total + item.subTotal, 0);
    }

    const registrosDelMesSeleccionado = filterRecordsByMonthAndYear(dataResponseRegisters, currentMonth, currentYear);
    // Agrupa registros por "descRegistro" y asigna colores
    const tipoColores: { [key: string]: string } = {};

    registrosDelMesSeleccionado.forEach((registro: Record) => {
        if (!tipoColores[registro.invoiceType]) {
            // Asignar un color aleatorio para cada "descRegistro"
            tipoColores[registro.invoiceType] = getRandomColor();
        }
    });

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const tipoFiltrado = filterByType === 'All' ? registrosDelMesSeleccionado : registrosDelMesSeleccionado.filter((registro) => registro.invoiceType === filterByType);

    let sumaDeValoresDelMes = 0;
    if (tipoFiltrado) {
        console.log('tipoFiltrado:');
        console.log(tipoFiltrado);
        //sumaDeValoresDelMes = tipoFiltrado.reduce((total: any, item: { subTotal: any }) => total + item.subTotal, 0);
        let sumaDeValoresDelMes: number;
        if (filterByType === "Purchase") {
            sumaDeValoresDelMes = tipoFiltrado.reduce((total: number, item: any) => total + (item.amount * item.price), 0);
        } else if (filterByType === "Sales") {
            sumaDeValoresDelMes = tipoFiltrado.reduce((total: number, item: any) => total + (item.amount * (item.price + (item.price * (item.utility / 100) || 0))), 0);
        } else {
            // Puedes agregar más casos según sea necesario
            console.error("Tipo de filtro no válido");
        }
        console.log('sumaDeValoresDelMes:' + getTopSellingProducts(tipoFiltrado, filterByType));
    }

    function sumPriceByDescription(records: Record[]): Record[] {
        const summarizedRecords: { [description: string]: Record } = {};

        records.forEach((record) => {
            const key = record.description;
            if (!summarizedRecords[key]) {
                summarizedRecords[key] = { ...record };
            } else {
                summarizedRecords[key].price += record.price;
            }
        });
        const result: Record[] = Object.values(summarizedRecords);
        return result;
    }

    function getTopSellingProducts(records: Record[], targetInvoiceType: string): Record[] {
        const filteredRecords = records.filter((record) => record.invoiceType === targetInvoiceType);

        const productSalesMap: { [productId: number]: number } = {};
        // Calcular la venta total de cada producto
        filteredRecords.forEach((record) => {
            const productSales = (() => {
                switch (targetInvoiceType) { // Cambiado de filterByType a targetInvoiceType
                    case "Purchase":
                        return record.price * record.amount;
                    case "Sales":
                        return record.amount * (record.price + (record.price * record.utility || 0));
                    default:
                        console.error("Tipo de filtro no válido");
                        return 0;
                }
            })();
            // Utilizar el productId como clave para sumar los valores
            productSalesMap[record.productId] = (productSalesMap[record.productId] || 0) + productSales;
        });

        // Crear un array de objetos con productId y totalSales
        const sortedProducts = Object.keys(productSalesMap)
            .map((productId) => ({
                productId: parseInt(productId),
                totalSales: productSalesMap[parseInt(productId)],
            }))
            .sort((a, b) => b.totalSales - a.totalSales);

        // Crear un mapa de registros únicos con la suma total
        const uniqueProductMap: { [productId: number]: Record } = {};
        filteredRecords.forEach((record) => {
            uniqueProductMap[record.productId] = uniqueProductMap[record.productId] || { ...record, totalSales: 0 };
            uniqueProductMap[record.productId].totalSales += productSalesMap[record.productId];
        });

        // Convertir el mapa a un array de registros únicos
        const topSellingProducts = Object.values(uniqueProductMap);

        return tipoFiltrado;
        //return sumPriceByDescription(topSellingProducts);
    }

    function calcularYModificar(records: Record[]): Record[] {
        const acumulador: Record[] = [];

        console.log("records:");
        console.log(records);


        // Recorrer el array de objetos
        records.forEach((record) => {
            const existingRecord = acumulador.find((r) => r.description === record.description);

            // Verificar si el producto ya está en el acumulador
            if (existingRecord) {
                // Sumar la cantidad al acumulador existente
                existingRecord.amount += record.amount;
            } else {
                // Agregar una nueva entrada al acumulador
                acumulador.push({ ...record });
            }
        });
        console.log("acumulador:");
        console.log(acumulador);

        return acumulador;
    }


    const topSellingProducts = calcularYModificar(tipoFiltrado);
    console.log('topSellingProducts:');
    console.log(topSellingProducts);

    // Crear el array de pieChartData para los productos más vendidos
    const pieChartData = topSellingProducts.map((product) => ({
        // value: product.price * product.amount,
        value: (() => {
            switch (filterByType) {
                case "Purchase":
                    return product.price * product.amount;
                case "Sales":
                    return product.amount * (product.price + (product.price * (product.utility / 100) || 0));
                default:
                    console.error("Tipo de filtro no válido");
                    return 0; // Otra opción podría ser asignar un valor predeterminado o lanzar una excepción
            }
        })(),
        label: product.description,
        fill: tipoColores[filterByType], // Puedes ajustar esto según sea necesario
    }));

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 10);
    }, []);

    //bar chart
    const generateChartData = (records: Record[]) => {
        // Verifica si no hay registros o el array está vacío
        if (!records || records.length === 0) {
            console.error("No hay registros para procesar en el gráfico");
            return { originalData: [], xAxisData: [{ data: [], scaleType: 'band' as const }] };
        }

        // Filtra los registros por tipo
        const type = "Sales";
        const filteredRecords = records.filter(record => record.invoiceType === type);

        // Verifica que haya registros después del filtro
        if (filteredRecords.length === 0) {
            console.error(`No hay registros de tipo ${type}`);
            return { originalData: [], xAxisData: [{ data: [], scaleType: 'band' as const }] };
        }

        const aggregatedData: { [key: string]: number } = {};
        const xAxisData: { data: string[]; scaleType: 'band' }[] = [{ data: [], scaleType: 'band' as const }];

        filteredRecords.forEach(record => {
            // Verifica que record tenga la propiedad 'description'
            if (record.description) {
                const sales = record.price * (record.utility / 100) * record.amount;
                if (aggregatedData[record.description] === undefined) {
                    aggregatedData[record.description] = sales;
                    xAxisData[0].data.push(record.description);
                } else {
                    aggregatedData[record.description] += sales;
                }
            } else {
                console.error(`Registro sin propiedad 'description': ${JSON.stringify(record)}`);
            }
        });
        // Verifica que haya datos después del proceso
        if (xAxisData[0].data.length === 0) {
            console.error("No hay datos para mostrar en el gráfico");
            return { originalData: [], xAxisData: [{ data: [], scaleType: 'band' as const }] };
        }
        // Corrección: Cambiar de map a reduce para acumular
        const originalData = xAxisData[0].data.map(description => aggregatedData[description]);

        return { originalData, xAxisData };
    };

    const { originalData, xAxisData } = generateChartData(registrosDelMesSeleccionado);
    const formatData = (data: any[]) => {
        return data.map(value => `$${value.toFixed(1)}k`);
    };
    const formattedData = formatData(originalData);
    const seriesData = [{ data: originalData }];
    const isChartDataEmpty = seriesData.length === 0 || xAxisData[0].data.length === 0;
    const height = 210;
    const margin = { top: 10, bottom: 30, left: 40, right: 10 };

    return (
        // <Container component="main" maxWidth="xs" sx={{ marginTop: 10, height: '540.5px' }}>
        <Container component="main" maxWidth="xs" className={`fade-in-vertical ${isVisible ? 'active' : ''} common-styles component-container-reports `}>
            <CssBaseline />
            <div style={{ textAlign: "center" }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Monthly Period
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="center">
                    <ShoppingCartIcon />
                    <Switch
                        checked={filterByType === 'Sales'}
                        onChange={(event) => setFilterByType(event.target.checked ? 'Sales' : 'Purchase')}
                        color="primary"
                        inputProps={{ 'aria-label': 'toggle type filter' }}
                    />
                    <PaidIcon />

                </Box>

                <Box display="flex" alignItems="center" justifyContent="center">
                    <IconButton onClick={handlePreviousDate}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Tabs
                        value={allDates.indexOf(`${months[currentMonth]} ${currentYear}`)}
                        onChange={handleTabClick}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {allDates.map((date, index) => (
                            <Tab key={date} label={date} value={index} style={{ width: "100%" }} />
                        ))}
                    </Tabs>
                    <IconButton onClick={handleNextDate}>
                        <ArrowForwardIcon />
                    </IconButton>
                </Box>

                {/* <Typography variant="h6">
                    Total Mes: {sumaDeValoresDelMes}
                </Typography> */}

                <div style={{ minWidth: '400px', minHeight: '210px' }}>
                    <h4 style={{ fontWeight: 'bold', textAlign: 'left', marginBottom: '5px' }}>{"Monthly " + filterByType}</h4>
                    {tipoFiltrado.length > 0 ? (
                        <PieChart
                            series={[
                                {
                                    data: pieChartData.map((item: { value: any; label: any; fill: any }, index: any) => ({
                                        id: index,
                                        value: item.value,
                                        label: item.label,
                                        fill: item.fill,
                                    })),
                                },
                            ]}
                            width={400}
                            height={210}
                        />
                    ) : (
                        <div style={{ minWidth: '400px', minHeight: '210px' }}>
                            <p style={{ margin: 0 }}>There is no data for the {filterByType} chart. </p>
                        </div>
                    )}
                    {/* </div>

                <div style={{ minWidth: '400px', minHeight: '230px' }}> */}
                    <h4 style={{ fontWeight: 'bold', textAlign: 'left', marginBottom: '5px' }}>{"Monthly Profits"}</h4>
                    {isChartDataEmpty ? (
                        <div style={{ minWidth: '400px', minHeight: '210px' }}>
                            <p style={{ margin: 0 }}>There is no data for the Profit chart.</p>
                        </div>
                    ) : (
                        <BarChart
                            series={seriesData}
                            height={height}
                            xAxis={xAxisData}
                            margin={margin}
                        />
                    )}
                </div>
                <form></form>
            </div>
        </Container>
    );
};

export default Reports;
