import React from 'react'
import { Link } from 'react-router-dom';
import { Avatar, Tag } from 'antd';
import { Loading } from '../../../obras/Loading'

export const ProductoCardAlmacen = ({producto,tipo}) => {
    const categoriaColor = (categoria) => {
        switch (categoria) {
            case "ferreteria":
                return <Tag color="cyan" key="ferreteria">{categoria.toUpperCase()}</Tag> 
            case "vinilos":
                return <Tag color="green" key="vinilos">{categoria.toUpperCase()}</Tag> 
            case "herramientas":
                return <Tag color="blue" key="herramientas">{categoria.toUpperCase()}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" key="pisosAzulejos">{categoria.toUpperCase()}</Tag>
            case "fontaneria":
                return <Tag color="red" key="fontaneria">{categoria.toUpperCase()}</Tag>
            case "iluminacion":
                return <Tag color="yellow" key="iluminacion">{categoria.toUpperCase()}</Tag>
            case "materialElectrico":
                return <Tag color="gold" key="materialElectronico">{categoria.toUpperCase()}</Tag>
            default:
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
        }
    }


    if(producto === null){
        return <Loading/>
    }else{
        switch (tipo) {
            case "devuelto":
                return (
                    <div className="row p-5 border" style={{maxWidth:"600px",minWidth:"350px"}}>
                        <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                            <Avatar shape="square" style={{height:"150px",width:"150px"}} src={`http://localhost:4000/api/uploads/productos/${producto.id._id}`}/>
                        </div>
                        <div className="col-12 col-lg-6">
                            <h5 className="fw-bold">{producto.id.nombre}</h5>
                            <p className="text-white bg-success">(cantidad devuelta a almacen {producto.cantidad})</p>
                            <span>Categorias del producto:</span><br/>
                            <div className="d-flex justify-content-start gap-2 flex-wrap mt-3">
                                {producto.id.categorias.map(categoria => categoriaColor(categoria))}
                            </div>
                            <p className="text-muted mt-3">{producto.id.descripcion}</p>
                            <Link to={`/almacen/productos/${producto.id._id}/`}>Ver información del producto</Link>
                        </div>
                    </div>
                ) 
            case "retirado":
                return (
                    <div className="row p-5 border" style={{maxWidth:"600px",minWidth:"350px"}}>
                        <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                            <Avatar shape="square" style={{height:"150px",width:"150px"}} src={`http://localhost:4000/api/uploads/productos/${producto.id._id}`}/>
                        </div>
                        <div className="col-12 col-lg-6">
                            <h5 className="fw-bold">{producto.id.nombre}</h5>
                            <p className="text-white bg-danger">(cantidad retirada del almacen: {producto.cantidad})</p>
                            <span>Categorias del producto:</span><br/>
                            <div className="d-flex justify-content-start gap-2 flex-wrap mt-3">
                                {producto.id.categorias.map(categoria => categoriaColor(categoria))}
                            </div>
                            <p className="text-muted mt-3">{producto.id.descripcion}</p>
                            <Link to={`/almacen/productos/${producto.id._id}/`}>Ver información del producto</Link>
                        </div>
                    </div>
                )               
            case "normal":
                return (
                    <div className="row p-5 border" style={{maxWidth:"600px",minWidth:"350px"}}>
                        <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                            <Avatar shape="square" style={{height:"150px",width:"150px"}} src={`http://localhost:4000/api/uploads/productos/${producto.id._id}`}/>
                        </div>
                        <div className="col-12 col-lg-6">
                            <h5 className="fw-bold">{producto.id.nombre}</h5>
                            <p className="text-white bg-success">(cantidad ingresada a almacen {producto.cantidad})</p>
                            <span>Categorias del producto:</span><br/>
                            <div className="d-flex justify-content-start gap-2 flex-wrap mt-3">
                                {producto.id.categorias.map(categoria => categoriaColor(categoria))}
                            </div>
                            <p className="text-muted mt-3">{producto.id.descripcion}</p>
                            <Link to={`/almacen/productos/${producto.id._id}/`}>Ver información del producto</Link>
                        </div>
                    </div>
                )  
        }
    }
}
