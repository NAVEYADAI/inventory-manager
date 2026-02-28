import { Typography } from "@mui/material";
import {
  SideContainer,
  StyledButton,
  StyledForm,
} from "./LoginAndSignin.style";
import { LoginFields, LogInFieldsHebNames, type Login } from "./util";
import TextInput from "../../components/Inputs/TextInput";
import { LogInTitle, SignUpTitle } from "../../titles";
import { login } from "../../api/login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type LogInProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  logIn: Login;
  setLogIn: React.Dispatch<React.SetStateAction<Login>>;
};

const LogIn = ({ setIsLogin, logIn, setLogIn }: LogInProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // בלוגין - mapping userName לפיקט password
      const payload = { userName: logIn.userName, password: logIn.password };
      await login(payload);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SideContainer>
        <Typography variant="h5">Welcome Back!</Typography>
        <Typography variant="body1">
          Log in to continue managing your inventory.
        </Typography>
        <StyledButton variant="outlined" onClick={() => setIsLogin(false)}>
          {SignUpTitle}
        </StyledButton>
      </SideContainer>
      <StyledForm onSubmit={handleSubmit}>
        <Typography variant="h4">Login</Typography>
        {Object.values(LoginFields).map((value) => (
          <TextInput
            key={value}
            label={LogInFieldsHebNames[value]}
            sx={{ margin: "8px", width: "250px" }}
            state={logIn[value as keyof Login] as string}
            setState={(str) =>
              setLogIn((prev) => ({
                ...prev,
                [value]: str,
              }))
            }
          />
        ))}
        {error && <Typography color="error">{error}</Typography>}
        <StyledButton variant="contained" type="submit" disabled={loading}>
          {loading ? "Logging in..." : LogInTitle}
        </StyledButton>
      </StyledForm>
    </>
  );
};

export default LogIn;
