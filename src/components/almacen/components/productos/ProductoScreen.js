import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, message, Modal, Select, Tabs, Tag, Upload,} from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
//import { EditInfo } from './components/EditInfo';
import { SocketContext } from '../../../../context/SocketContext';
import { ExclamationCircleOutlined,UploadOutlined,InboxOutlined } from '@ant-design/icons';
//import { RealizarRetiroAlmacen } from './components/RealizarRetiroAlmacen';
import { fetchConToken, fetchConTokenSinJSON } from '../../../../helpers/fetch';
import { Loading } from '../../../obras/Loading';
import { SalidasProducto }  from './components/SalidasProducto';
import { EntradasProducto } from './components/EntradasProducto';
import "./components/assets/style.css";
import { useForm } from '../../../../hooks/useForm';
import { useCategorias } from '../../../../hooks/useCategorias';

const { TabPane } = Tabs;
const { Dragger } = Upload;
const { confirm } = Modal;

export const ProductoScreen = () => {

    const {productoId} = useParams();
    const navigate = useNavigate();
	const [filesList, setFilesList] = useState([]);
    const [informacionProducto, setInformacionProducto] = useState({});
    const [uploading, setUploading] = useState(false);
	const { isLoading:isLoadingCategorias,categorias } = useCategorias();
    const {socket} = useContext(SocketContext);
    const [isProductoEditing, setIsProductoEditing] = useState(false);
    const [formValues,handleInputChange,setValues] = useForm({});
    
    //Formulario para editar informacion del producto

    useEffect(()=>{

        const fetchDataProducto = async () => {
            const resp = await fetchConToken(`/productos/${productoId}`);
            const body = await resp.json();
            if(resp.status === 200) setInformacionProducto(body);
            else{
                message.error("El ID del producto NO existe");
                return navigate(-1);
            }
        }
        fetchDataProducto();
    },[]);

    useEffect(() => {

        socket.on("actualizar-producto",(producto)=>{
            if(productoId === producto._id) setInformacionProducto(producto);
        });

    }, [socket,setInformacionProducto,productoId]);

    useEffect(() => {
        
        if(Object.keys(informacionProducto).length != 0){
            //Seteamos la informacion por si el usuario quisiera editar esta
            setValues({
                nombre:informacionProducto.nombre,
                marca:informacionProducto.marca,
                categorias:informacionProducto.categorias.map(categoria => categoria._id),
                inventariable:informacionProducto.inventariable,
                estado:informacionProducto.estado,
                estatus:informacionProducto.estatus,
                costo:informacionProducto.costo,
                descripcion:informacionProducto.descripcion,
                aplicaciones:informacionProducto.aplicaciones,
                unidad:informacionProducto.unidad
            })
        }
    }, [informacionProducto]);


    const categoriaColor = (categoria) => {
        switch (categoria.toLowerCase()) {
            case "ferreteria":
                return <Tag color="cyan" style={{fontSize:"13px",padding:"13px"}} key="ferreteria">{categoria}</Tag> 
            case "vinilos":
                return <Tag color="green" style={{fontSize:"13px",padding:"13px"}} key="vinilos">{categoria}</Tag> 
            case "herramientas":
                return <Tag color="blue" style={{fontSize:"13px",padding:"13px"}} key="herramientas">{categoria}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" style={{fontSize:"13px",padding:"13px"}} key="pisosAzulejos">{categoria}</Tag>
            case "fontaneria":
                return <Tag color="red" style={{fontSize:"13px",padding:"13px"}} key="fontaneria">{categoria}</Tag>
            case "iluminacion":
                return <Tag color="yellow" style={{fontSize:"13px",padding:"13px"}} key="iluminacion">{categoria}</Tag>
            case "materialElectrico":
                return <Tag color="gold" style={{fontSize:"13px",padding:"13px"}} key="materialElectrico">{categoria}</Tag>
            case "selladores":
                return <Tag color="gold" style={{fontSize:"13px",padding:"13px"}} key="selladores">{categoria}</Tag>
            default:
                return <Tag color="green" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag> 
        }
    }

    const props = {
        onRemove : file => {
            setFilesList([]);
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma funci??n*/
        },
        beforeUpload: file => {
            //Verificar que el fileList sea menos a 2 
            if(filesList.length < 1){
                setFilesList(files => [...files,file]);
            }else{
                message.error("Solo puedes subir 1 archivo en total");
            }
            //Deestructuramos el estado actual y a??adimos el nuevo archivo
            return false;
        },
        maxCount:1,
        fileList : filesList
    };

    const onFinishEditingProduct = () => {
        for (const property in formValues){
            if(formValues[property] === "") return message.error("Faltan registros por completar!");
        }
		confirm({
            title:"??Seguro quieres editar la informacion del producto?",
            icon:<ExclamationCircleOutlined />,
            content:"La informacion del producto se vera cambiada y se anadira un registro de la accion.",
			okText:"Editar",
			cancelText:"Volver atras",
            async onOk(){
				setUploading(true);
        		const formData = new FormData();
				formData.append("nombre",formValues.nombre);
				formData.append("descripcion",formValues.descripcion);
				formData.append("marca",formValues.marca);
				formData.append("categorias",JSON.stringify(formValues.categorias));
				formData.append("estado",formValues.estado);
				formData.append("estatus",formValues.estatus);
				formData.append("unidad",formValues.unidad);
				formData.append("inventariable",formValues.inventariable);
				formData.append("aplicaciones",formValues.aplicaciones)
                if(filesList.length != 0){
                    filesList.forEach(file => {
            		    formData.append("archivo",file);
        		    });
                }
                const resp = await fetchConTokenSinJSON(`/productos/${productoId}`,formData,"PUT");
				const body = await resp.json();
				if(resp.status === 200){
					message.success(body.msg);
                    setIsProductoEditing(false)
                    setInformacionProducto(body.producto);
				    setFilesList([]);
                    //Mandar a actualizar el producto
                    socket.emit("actualizar-producto",{id:productoId});
				}else{
					message.error(body.msg);
                    setIsProductoEditing(false)
				}
				setUploading(false);
           	},
        });
    }

    if( Object.keys(informacionProducto).length === 0 || isLoadingCategorias){
        <Loading/>
    }else{
        return (

            <div className="container p-3 p-lg-5">
                <div className="d-flex justify-content-end gap-2 flex-wrap">
                    {!isProductoEditing && <Link to="/almacen/productos"><Button type="primary">Regresar a lista de productos</Button></Link>}
                    {isProductoEditing && <Button type="primary" danger onClick={()=>{setIsProductoEditing(false)}}>Salir sin guardar</Button>}
                    {isProductoEditing ? <Button type="primary" warning onClick={()=>{onFinishEditingProduct();}}>Guardar cambios</Button> : <Button type="primary" onClick={()=>{setIsProductoEditing(true)}}>Editar informacion</Button> }
                </div>
                 <div className="row mt-5">
                    {/* Imagen del producto*/}
                    <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center">
                        {isProductoEditing
                            ?
					            <Dragger {...props} height="300px" className="p-5">
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click o arrastra la nueva foto de el producto</p>
                                    <p className="ant-upload-hint">
                                        Soporte solo para una imagen ya sea de tipo PNG o JPG.
                                    </p>
                                </Dragger>
                            :
                                <img src={`http://localhost:4000/api/uploads/productos/${informacionProducto._id}`} className="imagen-producto" key={`http://localhost:4000/api/uploads/productos/${informacionProducto._id}`}/>
                        }
                    </div>

                    {/* Informacion basica del producto*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        {isProductoEditing
                            ?
                                <input
                                    className="form-control nombre-producto"
                                    value={formValues.nombre}
                                    name="nombre" 
                                    onChange={handleInputChange}
                                />
                            :
                                <h1 className="nombre-producto">{informacionProducto.nombre}</h1>
                        }
                        {isProductoEditing 
                            ?
                                <select id="estatus" className="form-select mt-3 w-50 descripcion" aria-describedby="inventariableHelpBlock" value={formValues.estatus} name="estatus" onChange={handleInputChange}>
                                    <option className="text-success" value={true}>Disponible</option>
                                    <option className="text-danger" value={false}>NO disponible</option>
                                </select>
                            :
                                informacionProducto.estatus ? <h1 className="text-success estatus-producto">Disponible</h1> : <h1 className="text-danger estatus-producto">No disponible</h1>
                        } 
                        {isProductoEditing 
                            ?
                                <Select className="my-4" style={{width:"50%",borderRadius: "0.25rem"}} mode="multiple" value={formValues.categorias} onDeselect={(e)=>{setValues(state => ({...state,categorias:state.categorias.filter(categoria => categoria != e)}))}} placeholder="Categoria o categorias a la que pertenece este producto." size="large" name="categorias" onChange={(e)=>{setValues(state => ({...state,categorias:[...new Set([...state.categorias,...e])]}))}}>
						                {categorias.map(categoria => {
							                return (
                  				                <Select.Option value={categoria._id}>{categoria.nombre}</Select.Option>
							                )
						                })}
              		            </Select>
                            :
                                <div className="d-flex justify-content-start gap-2 flex-wrap mt-3 mb-3">
                                    {informacionProducto?.categorias?.map(categoria => categoriaColor(categoria.nombre))}
                                </div> 
                        }
                        <h1 className="titulo-descripcion">Precio promedio X unidad:</h1>
                        <h1 className="precio-por-unidad-producto">${informacionProducto.costo}</h1>
                        <div className="row mt-5">
                            <h1 className="titulo-descripcion col-6">Cantidad en bodega:</h1>
                            <h1 className="descripcion col-6">{informacionProducto.cantidad}</h1>
                            {isProductoEditing
                                ?
                                <>
                                    <h1 className="titulo-descripcion col-6 mt-3">Marca:</h1>
                                    <input
                                        className="form-control col-5 w-50 descripcion mt-3"
                                        placeholder="Marca del producto" size="large"
                                        value={formValues.marca}
                                        name="marca" 
                                        onChange={handleInputChange}
                                        autoComplete = "disabled"
                                        required
                                    />
                                </>
                                :
                                <>
                                    <h1 className="titulo-descripcion col-6">Marca:</h1>
                                    <h1 className="descripcion col-6">{informacionProducto.marca}</h1>
                                </>
                            }
                            {isProductoEditing
                                ?
                                <>
                                    <h1 className="titulo-descripcion col-6 mt-3">Unidad: </h1>
                                    <select id="unidad" className="form-select mt-3 col-5 w-50 descripcion" aria-describedby="inventariableHelpBlock" value={formValues.unidad} name="unidad" onChange={handleInputChange}>
                                        <option value={"Metro"}>Metro</option>
                                        <option value={"Kilogramo"}>Kilogramo</option>
                                        <option value={"Pieza"}>Pieza</option>
                                        <option value={"Litro"}>Litro</option>
                                    </select>
                                </>
                                :
                                <>
                                    <h1 className="titulo-descripcion col-6">Unidad: </h1>
                                    <h1 className="descripcion col-6">{informacionProducto.unidad}</h1>
                                </>
                            }
                            {isProductoEditing 
                                ? 
                                <>
                                    <h1 className="titulo-descripcion col-6 mt-3">Estado del producto: </h1>
                                    <select id="estado" className="form-select col-5 mt-3 w-50 descripcion" aria-describedby="inventariableHelpBlock" value={formValues.estado} name="estado" onChange={handleInputChange}>
                                        <option value={"Nuevo"}>Nuevo</option>
                                        <option value={"Usado"}>Usado</option>
                                    </select>
                                </>
                                :
                                <>
                                <h1 className="titulo-descripcion col-6">Estado del producto: </h1>
                                    <h1 className="descripcion col-6">{informacionProducto.estado}</h1>
                                </>
                                }
                            {isProductoEditing 
                                ? 
                                    <>
                                        <h1 className="titulo-descripcion col-6 mt-3">Fecha de registro en el sistema: </h1>
                                        <h1 className="descripcion col-6 text-danger mt-3">{informacionProducto.fechaRegistro}</h1>
                                    </>
                                :
                                    <>
                                        <h1 className="titulo-descripcion col-6 ">Fecha de registro en el sistema: </h1>
                                        <h1 className="descripcion col-6 text-danger">{informacionProducto.fechaRegistro}</h1>
                                    </>
                                }
                            <p className="mt-5 nota col-12 text-center">Para mas detalles del producto comunicate a almacen...</p>
                        </div>
                    </div>
                    
                    <div className="col-lg-6 col-12 d-flex flex-column" >
                        <Divider/>
                        <h1 className="nombre-producto">Registros de el producto</h1>
                        <Tabs defaultActiveKey='1' key="1" size="large">
                            <TabPane tab="Entradas del producto">
                                <EntradasProducto registros={informacionProducto.registrosEntradas}/>
                            </TabPane>
                            <TabPane tab="Salidas del producto" key="2">
                                <SalidasProducto registros={informacionProducto.registrosSalidas}/>
                            </TabPane>
                        </Tabs>
                    </div>

                    {/* Descripcion del producto y sus aplicaciones*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <Divider/>
                        <h1 className="nombre-producto">Descripcion del producto</h1>
                        {isProductoEditing ? <textarea class="form-control descripcion-producto" rows={5} value={formValues.descripcion} name="descripcion" onChange={handleInputChange}></textarea> : <h1 className="descripcion-producto">{informacionProducto.descripcion}</h1>}
                        <Divider/>
                        <h1 className="nombre-producto">Aplicaciones del producto</h1>
                        {isProductoEditing ? <textarea class="form-control descripcion-producto" rows={5} value={formValues.aplicaciones} name="aplicaciones" onChange={handleInputChange}></textarea> : <h1 className="descripcion-producto">{informacionProducto.aplicaciones}</h1>}
                    </div>
                 </div>
            </div>
        )
    }
};