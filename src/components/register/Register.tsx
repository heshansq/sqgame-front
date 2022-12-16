import { useNavigate } from 'react-router-dom';
import { User } from '../../models/user.model';
import Header from '../../pages/Header';
import { mainService } from "../../services/main.service";

const Register = () => {

    const navigate = useNavigate();

    const handleRegister = (e: any) => {
        e.preventDefault();
        
        let userEmail = e.target[0].value;
        let userName = e.target[1].value;
        let userPassword = e.target[2].value;

        let user: User = {email: userEmail, name: userName, password: userPassword};

        mainService.registerUser(user).then((response: any) => {
            console.log('User Created::', { response });
            navigate('/');
        }).catch((error: any) => {
            console.log({error});
        });
    }

    return (
        <>
            <Header/>
            <div className="login-wrapper">
                <div className="login-wrapper-inner">
                    <form onSubmit={handleRegister}>
                        <input type="email" required placeholder="Please Enter Email Address"/>
                        <input type="name" required placeholder="Please Enter your First Name"/>
                        <input type="password" required placeholder="Please Enter Password"/>
                        <input type="submit" value="Login"/>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Register;