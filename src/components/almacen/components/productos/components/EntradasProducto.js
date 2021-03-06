import { Button, Col, Divider, Drawer, Input, Row, Table, Tag } from 'antd'
import React, { useState, useEffect } from 'react'

export const EntradasProducto = ({registros}) => {

    const [registrosEntradas, setRegistrosEntradas] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [informacionRetiro, setInformacionRetiro] = useState(null);

    useEffect(() => {
        registros.sobranteObra.map(registro => {registro.tipo = "sobrante-obra"; registro.key = registro._id;});
        registros.devolucionResguardo.map(registro => {registro.tipo = "devolucion-resguardo"; registro.key = registro._id})
        registros.normal.map(registro => {registro.tipo = "normal"; registro.key = registro._id})
        setRegistrosEntradas([...registros.sobranteObra,...registros.devolucionResguardo,...registros.normal]);
    }, [registros]);

    
    const columns = [            
        {
            title:"Tipo de entrada",
            key:"tipoEntrada",
            dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "sobrante-obra":
                        return (
                            <Tag color="green">SOBRANTE-OBRA</Tag>
                        )
                    case "devolucion-resguardo":
                        return (
                            <Tag color="yellow">DEVOLUCION-RESGUARDO</Tag>
                        )
                    case "normal":
                        return (
                            <Tag color="blue">NORMAL</Tag>
                        )
                }
            }
        },
        {
            title:"Cantidad ingresada",
            key:"cantidad",
            dataIndex:"cantidad"
        },
        {
            title:"Fecha del ingreso",
            key:"fecha",
            dataIndex:"fecha"
        },
    ];
    
    return (
        <>
            <Table columns={columns} dataSource={registrosEntradas} pagination={{pageSize:4}} size="large" bordered/>
        </>
    )
}
