import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    //as soon as we load in we try to call auth, if not we set isAuthorized to false which will then return us to login
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    //will refresh token as needed
    const refreshToken = async () => {

        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try {
            //res will contain the result of the post request --> which is a new access token 
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    //will check if we need to refresh token
    const auth = async () => {
        //check if we have token first
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000; //date in seconds

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    //will show loading as long as isAuthorized is null
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // will navigate to login page if not authorized or show children components if authorized 
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;