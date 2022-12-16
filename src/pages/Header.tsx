import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mainService } from "../services/main.service";
const Header = () => {

    const [userData, setUserData] = useState<any>();
    const navigate = useNavigate();

    useEffect(() => {
        let strUserData = localStorage.getItem('userdata');
        let userData;
        if (strUserData) {
            userData = JSON.parse(strUserData);
            setUserData(userData);
        } 
    }, []);

    const logoutUser = () => {
        if (userData && userData?.user?.id) {
            localStorage.removeItem('userdata');
            console.log('userData::', {userData});
            mainService.updateConnectionId(userData?.user?.id, '').then((res) => {
                console.log('removed connection id');
            }).finally(() => {
                navigate('/');
            });
        }
    }

    return (
        <>
            <div className="header-wrapper">
                <ul>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                    <li>
                        <Link to="/">Login</Link>
                    </li>
                    {userData ? (
                        <li>
                            <a onClick={logoutUser}>Logout</a>
                        </li>
                    ) : null}
                    
                </ul>
            </div>
        </>
    );
}
export default Header;