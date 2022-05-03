import { Button, DatePicker, Form, Input, InputNumber, Select, Space, Tag ,Upload} from 'antd'
import { Option } from 'antd/lib/mentions'
import React, { useContext, useState } from 'react'
import { Row, Col } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { SocketContext } from '../../context/SocketContext';
import { useSelector } from 'react-redux';


export const RegistrarProducto = () => {
  const [form] = Form.useForm();
  const [value, setValue] = useState(false);


  //Socket communication
  const { socket } = useContext(SocketContext);

  const {uid,name} = useSelector((state) => state.auth);

  const onFinish = ( values ) =>{
    setValue(true);
    //Emitir evento al backend de crear nuevo producto!
    socket.emit("producto-nuevo",{...values,uid,name});
    setValue(false);
  }


  
  return (
    <div className="container mt-5 shadow p-5 rounded">
      <h1>Registro de producto</h1>
      <span>Campos con <Tag color="red">*</Tag>son obligatorios.</span>
      <div className="mt-3">
      <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="nombre" 
              tooltip="Ingresa el nombre del producto"
              label="Nombre del producto"
              rules={[
                {
                  required:true,
                  message:"Debes ingresar el nombre del producto",
                  whitespace: true
                }
              ]}
              >
              <Input placeholder="Bote de pintura"/>
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item 
              name="marcaProducto" 
              tooltip="Ingresa la marca del producto"
              label="Marca del producto"
              rules={[
                {
                  required:true,
                  message:"Debes ingresar la marca del producto, ingresa desconocido si no la sabes",
                  whitespace: true
                }
              ]}
              >
              <Input placeholder="Comex"/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Imagen del producto" rules={[{required:true,message:"Selecciona una imagen del producto!",whitespace:true}]} tooltip="Toma una imagen clara del producto donde se observe el nombre y se pueda ver el estado del mismo (Preferiblemente en el sol)">
              <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent noStyle >
                <Upload.Dragger name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or arrastra un archivo de imagen</p>
                  <p className="ant-upload-hint">Soporte para solo una imagen</p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </Col>
         
            <Col span={12}>
            <Form.Item
              name="categorias"
              rules={[{ required: true, message: 'Porfavor selecciona la o las categorias del producto!', type: 'array' }]}
              tooltip="Ingresa la categoria o las categorias del producto"
              label="Categorias del producto"
            >
              <Select mode="multiple" placeholder="Ferreteria,Electrico,Herramientas,etc.">
	              <Select.Option value="ferreteria">Ferreteria</Select.Option>
                <Select.Option value="vinilos">Vinilos</Select.Option>
                <Select.Option value="herramientas">Herramientas</Select.Option>
                <Select.Option value="pisosAzulejos">Pisos y azulejos</Select.Option>
                <Select.Option value="Fontaneria">Fontaneria</Select.Option>
                <Select.Option value="Iluminacion">Iluminación</Select.Option>
                <Select.Option value="electrico">Material electrico</Select.Option>
            </Select>
          </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
                label="Cantidad en bodega :" 
                name="cantidad"
                tooltip="Ingresa la cantidad de unidades del producto en bodega..."
                >
                <InputNumber style={{width: "100%"}} min={1} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item 
                label="Descripción del producto"
                name="descripcion"
                tooltip="Ingresa una descripción corta sobre el producto"
                rules={[
                  {
                    required:true,
                    message:"Debes ingresar una descripción",
                    whitespace:true
                  }
                ]}
                >
              <Input.TextArea allowClear showCount minLength={20} maxLength={60} style={{width:"100%"}} placeholder="Descripción del producto" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
                label="Costo del producto " 
                name="costo"
                tooltip="Ingresa el costo del producto medio"

                >
                <InputNumber style={{width: "100%"}} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
            name="estadoProducto"
            label="Estado del producto"
            rules={[
              {
                required: true,
                message: 'Selecciona el estado del producto!',
              },
              ]}
            >
            <Select placeholder="¿Como se encuentra el producto?">
              <Select.Option value="nuevo">Nuevo</Select.Option>
              <Select.Option value="usado">Usado</Select.Option>
            </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="date-picker" label="Ultima revisión en bodega (por defecto hoy)" >
              <DatePicker style={{width:"100%"}}/>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
                name="inventariable"
                label="Inventariable"
                tooltip="Los productos NO invetariables son aquellos que NO son de valor o que son muy pequeños ejemplo serian tornillos,tuercas,etc."
                rules={[
              {
                required: true,
                message: 'El producto necesita tener este parametro',
              },
              ]}
            >
            <Select placeholder="¿El producto es inventariable?">
              <Select.Option value="inventariable">Inventariable</Select.Option>
              <Select.Option value="no-inventariable">NO inventariable</Select.Option>
            </Select>
            </Form.Item>
          </Col>
            <Col span={12}>
              <Link to="/aplicacion/almacen/" className='btn btn-outline-danger rounded p-md-3 mt-4'><i className="fa-solid fa-xmark"></i>   Cancelar registro </Link>
            </Col>

            <Col span={12}>
              <Space direction="horizontal" style={{width: '100%', justifyContent: 'end'}}>
              <button className='btn btn-outline-primary rounded p-md-3 mt-4' type="submit" disabled={value}>Registrar Producto   <i className="fa-solid fa-arrow-right"></i> </button>
              </Space>
            </Col>
        </Row>
      </Form>
        

           

        


        

         
          
      
        </div>
     
    </div>
  )
}