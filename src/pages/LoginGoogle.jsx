import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

function LoginGoogle({ onLogin }) {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    const idToken = credentialResponse.credential;
    const decoded = jwtDecode(idToken);
    console.log("✅ Google ID Token:", decoded);

    fetch(`${apiUrl}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: idToken }), // <-- key is 'credential'
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          sessionStorage.setItem("jwt_token", data.access_token);
          sessionStorage.setItem("user_email", decoded.email);
          onLogin(decoded.email);
          navigate("/dashboard");
        } else {
          alert("Erreur de connexion: " + (data.detail || "Token invalide"));
        }
      })
      .catch(error => {
        console.error("Erreur lors de la connexion:", error);
        alert("Erreur de connexion au serveur");
      });
  };

  const handleError = () => {
    console.log("❌ Erreur de connexion Google");
    alert("Échec de la connexion Google. Veuillez réessayer.");
  };

  return (
    <div className="flex justify-center mt-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}

export default LoginGoogle;
