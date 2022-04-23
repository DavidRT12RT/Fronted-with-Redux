import {Link, useNavigate} from "react-router-dom";

import {useForm} from "../../hooks/useForm";
import './Style.css';
//import "../../Styles/style.css";
import { Navbar } from "../ui/NavbarBootstrap";
import { useDispatch, useSelector } from "react-redux";
import { startLoginEmailPassword } from "../../actions/authActions";

//Note: You must use htmlfor instead of for in label tags when react is use 
    
   
    
export const LoginScreen = () => {

    //Hook personalizado para el formulario
    const [formValues,handleInputChange] = useForm({
        email:'examle@gmail.com',
        password:'123456'
    });

    const {email,password} = formValues;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    //State
    const loading = useSelector((state)=> state.ui.loading);

    
       
    const handleLogin=(e)=>{
        e.preventDefault();
        dispatch(startLoginEmailPassword(email,password));
    }
    

    return <>
        <Navbar/>
    (
    <div className="w-100 d-md-block container w-75 bg-primary rounded shadow margin-top">
        <div className="row align-items-lg-stretch">
            <div className="col bg d-none d-lg-block col-md-5 col-lg-5 col-xl-6 rounded">
            </div>
            <div className="col bg-white p-5 rounded-end">
                <div className="text-end">
                    <img src={require('./assets/logo.png')} width="100" alt="logo"/>
                </div>
                <h2 className="fw-bold text-center py-5">Bienvenido</h2>
                <form id="iniciarSesion" className="needs-validation" noValidate onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="form-label">Correo Electronico</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={email}
                            onChange={handleInputChange}
                            autoComplete = "disabled"
                            id="email"  
                            className="form-control" 
                            required/>

                        <div className="valid-feedback">Luce bien!</div>
                        <div className="invalid-feedback">Complete los datos</div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Contraseña</label>

                        <input 
                            type="password" 
                            name="password" 
                            value={password}
                            onChange={handleInputChange}
                            id="password" 
                            placeholder="******"
                            className="form-control" 
                            required/>

                        <div className="valid-feedback">Luce bien!</div>
                        <div className="invalid-feedback">Complete los datos</div>
                    </div>
                    <div className="mb4 form-check">
                        <input type="checkbox" name="connected" className="form-check-input" id="" />
                        <label className="form-check-label">Permanecer conectado</label>
                    </div>
                    <div className="d-grid mt-5">
                        <button type="submit" className="btn btn-warning" id="btnEnviar" disabled={loading}>Login</button>
                    </div>
                    <span className="w-100 mt-5 d-flex justify-content-center">No tienes cuenta? </span>
                    <div className="d-flex justify-content-center px-5 w-auto">
                        <span className="mx-2"><Link to="#">Registrate</Link></span>
                        <span ><Link to="#">Recuperar password</Link></span>
                    </div>
                </form>
                
            </div>
        </div>
    </div> 
    );
    </>
};
