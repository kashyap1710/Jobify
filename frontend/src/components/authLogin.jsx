import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth Status:", { isAuthenticated, isLoading, error });

    if (error) {
      console.error("Auth0 Error:", error);
    }

    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
      console.log("Redirecting to login...");
      
     } 
    else if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, isLoading, error, navigate,loginWithRedirect]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (isAuthenticated) return <div>Redirecting...</div>;

  return null;
};

export default AuthLogin;
