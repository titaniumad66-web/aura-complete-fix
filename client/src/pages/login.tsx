import { useState } from "react";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [, setLocation] = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isLogin ? "/api/login" : "/api/register";

    const bodyData = isLogin
      ? { username, password }
      : { username, email, password };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert(isLogin ? "Login successful ✅" : "Registered successfully 🎉");
      setLocation("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #fceabb, #f8b500, #ff758c, #ff7eb3)",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          color: "white",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isLogin ? "Welcome Back ✨" : "Create Account 🎂"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />

          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "white",
  color: "#ff758c",
  fontWeight: "bold",
  cursor: "pointer",
};