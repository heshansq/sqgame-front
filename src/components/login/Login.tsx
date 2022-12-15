import { useNavigate } from 'react-router-dom';
import { mainService } from "../../services/login.service";

const Login = () => {

    const navigate = useNavigate();

    const handleLogin = (e: any) => {
        e.preventDefault();
        
        let userEmail = e.target[0].value;
        let userPassword = e.target[1].value;

        mainService.loginUser(userEmail, userPassword).then((response: any) => {
            console.log({ response });
            localStorage.setItem('userdata', JSON.stringify(response?.data));
            navigate('/home');
        }).catch((error: any) => {
            console.log({error});
        });
    }

    return (
        <>
            <div className="login-wrapper">
                <div className="login-wrapper-inner">
                    <form onSubmit={handleLogin}>
                        <input type="email" required placeholder="Please Enter Email Address"/>
                        <input type="password" required placeholder="Please Enter Password"/>
                        <input type="submit" value="Login"/>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Login;