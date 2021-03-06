import { Button, Form, Input, message, Modal, Result, Select, Table, Tag, Typography } from 'antd'
import React, { useEffect } from 'react'
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner'
import { useCategorias } from '../../../../hooks/useCategorias'
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchConToken } from '../../../../helpers/fetch';
const { Paragraph, Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;

export const CategoriasRegistradas = () => {
    
    const { isLoading, categorias, setCategorias } = useCategorias()
    const [isModalVisible, setIsModalVisible] = useState(false);


    //Marca cuando la categoria se este registrando
    const [form] = Form.useForm();
	const [uploading, setUploading] = useState(false);
    const [finishCategoriaRegistrada, setFinishCategoriaRegistrada] = useState(false);



    //Editar categoria
    const [categoriaEditing, setCategoriaEditing] = useState(null);

    //Crear un nueva categoria 
    const onFinish = async ( values ) =>{                    

		confirm({
            title:"¿Seguro quieres registrar esta nueva categoria?",
            icon:<ExclamationCircleOutlined />,
            content:"La categoria sera creada y podras registrar productos con esta misma.",
			okText:"Registrar",
			cancelText:"Volver atras",
            async onOk(){
				setUploading(true);
				//Emitir evento al backend de crear nuevo producto!
				const resp = await fetchConToken("/categorias",{nombre:values.nombre,estatus:values.estatus},"POST");
				const body = await resp.json();
				if(resp.status === 201){
					message.success(body.msg);
                    setCategorias(categorias => [...categorias,body.categoria]);
                    setFinishCategoriaRegistrada(true);
					//navigate(`/almacen/productos/${body._id}`);
				}else{
                    message.error(body.msg);
                }
				setUploading(false);
				form.resetFields();
           	},
        });
    }

    //Borrar una categoria --Solo ENCARGADO_ALMACEN_ROL o ADMIN_ROLE

    const handleDeleteCategoria = (id) => {
		confirm({
            title:"¿Seguro quieres eliminar esta categoria?",
            icon:<ExclamationCircleOutlined />,
            content:"La categoria sera borrada y todos los productos con esta categoria eliminaran esta de su lista respectivamente.",
			okText:"Eliminar",
			cancelText:"Volver atras",
            async onOk(){
				setUploading(true);
                    const resp = await fetchConToken(`/categorias/${id}`,{},"DELETE");
                    const body = await resp.json();
                    if(resp.status === 200){
                        message.success(body.msg);
                        const nuevoRegistrosCategorias = categorias.filter(categoria => categoria._id != id);
                        setCategorias(nuevoRegistrosCategorias);
                    }else{
                        message.error(body.msg);
                    }
                setUploading(false);
           	},
        });
    }

    //Editar una categoria un nueva categoria 
    const onFinishEditarCategoria = async ( values ) =>{                    

		confirm({
            title:"¿Seguro quieres editar esta categoria?",
            icon:<ExclamationCircleOutlined />,
            content:"La categoria sera editada y en el caso de cambiar el nombre , todos los productos con la categoria anterior cambiaran su nombre respectivamente.",
			okText:"Editar",
			cancelText:"Volver atras",
            async onOk(){
				setUploading(true);
				//Emitir evento al backend de crear nuevo producto!
					const resp = await fetchConToken(`/categorias/${categoriaEditing._id}`,{nombre:values.nombre,estatus:values.estatus},"PUT");
					const body = await resp.json();
					if(resp.status === 200){
						message.success(body.msg);
                        const nuevoRegistrosCategorias = categorias.map(categoria => {
                            if(categoria._id === body.categoria._id) return body.categoria
                            return categoria;
                        });
                        setCategorias(nuevoRegistrosCategorias);
                        setIsModalVisible(false);
					}else{
                        message.error(body.msg);
                    }
				setUploading(false);
				form.resetFields();
           	},
        });
    }

    const columns = [
        {
            title:"Nombre de la categoria",
            dataIndex:"nombre"
        },
        {
            title:"Estado de la categoria",
            dataIndex:"estado",
            render:(text,record)=> {
                if(record.estatus){
                    return <Tag color={"green"} key={record._id}>Activa</Tag>
                }else{
                    return <Tag color={"red"} key={record._id}>Desactivada</Tag>
                }
            }
        },
        {
            title:"Cantidad de productos registrados",
            dataIndex:"productosRegistrados",
            render:(text,record)=>{
                return <span>{record.productosRegistrados.length}</span>
            }
        },
        {
            title:"Categoria registrada por",
            dataIndex:"usuario",
            render:(text,record)=>{
                return <span className="fw-bold">{record.usuario.nombre}</span>
            }
        },
        {
            title:"Fecha de registro",
            dataIndex:"fechaRegistro"
        },
        {
            title:"Acciones",
            render:(text,record)=>{
                return (
                    <div className="d-flex justify-content-center gap-2">
                        <Button type="primary" onClick={()=>{setCategoriaEditing(record);setIsModalVisible(true)}}>Editar</Button>
                        <Button type="primary" danger onClick={()=>{handleDeleteCategoria(record._id)}}>Eliminar</Button>
                    </div>
                )
            }
        }
    ];

    useEffect(() => {
        if(categoriaEditing != null){
            form.setFieldsValue({
                nombre:categoriaEditing.nombre,
                estatus:categoriaEditing.estatus
            })
        }else if(categoriaEditing === null){
            form.setFieldsValue({
                nombre:"",
                estatus:true
            })
        }
    }, [categoriaEditing]);
    
    if(isLoading){
        return <SanzSpinner/>
    }else if(finishCategoriaRegistrada){
		return (
			<Result
    			status="success"
    			title="Categoria creada con exito!"
    			subTitle="Categoria creada con exito, puedes proceder a crear productos con esta categoria!"
    			extra={[<Button type="primary" key="console" onClick={()=>{setFinishCategoriaRegistrada(false);setIsModalVisible(false)}}>Ver categorias</Button>,<Button onClick={()=>{setFinishCategoriaRegistrada(false)}}>Registrar una nueva categoria</Button>,]}
			/>
        )
    }else{
        categorias.map(categoria => {categoria.key = categoria._id});
        return (
            <>
                <div className="container p-5" style={{}}>
                        <h1 className="display-5 fw-bold mt-5 mt-lg-0">Lista de categorias</h1>
                        <hr/> 
                        <Button type="primary" onClick={()=>{setIsModalVisible(true);setCategoriaEditing(null)}}>Nueva categoria</Button>
                        <Table columns={columns} dataSource={categorias} className="mt-3" />
                </div>

                <div className="container p-5 mt-5">
                    <Paragraph>
                        <Text strong style={{fontSize: 16}}>
                            Ten en cuenta los siguientes puntos antes de registrar una nueva categoria o editar una de estas.
                        </Text>
                    </Paragraph>
                    <Paragraph>
                            <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                            Al marcar una categoria como "desactivada" no podras añadir mas productos con esta categoria
                    </Paragraph>
                    <Paragraph>
                            <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                            Al cambiar el nombre de una categoria , todos los productos que tengan esta categoria cambiaran el nombre de esta misma respectivamente.
                    </Paragraph>
                    <Paragraph>
                            <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                            Al eliminar una categoria todos los productos que tengan esta misma la eliminaran de su lista de categorias respectivamente.
                    </Paragraph>
                </div>
                <Modal footer={null} onCancel={()=>{setIsModalVisible(false)}} visible={isModalVisible}>
                    {categoriaEditing != null ? <h2 className="fw-bold">Editar una categoria</h2> : <h2 className="fw-bold">Registrar una nueva categoria</h2> }
					<Form form={form} layout="vertical" autoComplete="off" onFinish={(values)=>{
                        categoriaEditing != null ? onFinishEditarCategoria(values) : onFinish(values);
                    }}>
              			<Form.Item 
                			name="nombre" 
                			tooltip="Ingresa el nombre de la categoria"
                			label="Nombre categoria"
				            rules={[{required:true,message:"Debes ingresar el nombre del producto",whitespace: true}]}
                		>
                		    <Input placeholder="Nombre de la categoria" size="large"/>
              		    </Form.Item>

                        <Form.Item name="estatus" tooltip="Marca el estado de la categoria" label="Estado de la categoria">
                            <Select size="large">
                                <Option value={true} key={"Activada"}>Activada</Option>
                                <Option value={false} key={"Desactivada"}>Desactivada</Option>
                            </Select>
                        </Form.Item>
						
                        {categoriaEditing != null ? <Button type="primary" block htmlType="submit" size="large">{uploading ? "Editando categoria..." : "Editar categoria"}</Button> : <Button type="primary" block htmlType="submit" size="large">{uploading ? "Registrando categoria..." : "Registrar categoria"}</Button> }
        			</Form>
                </Modal>
            </>
        )
    }
}
