import { Typography, Box, Alert, CircularProgress } from "@mui/material";
import { StyledForm, ActionButton } from "./LoginAndSignin.style";
import { LoginFields, LogInFieldsHebNames, type Login } from "./util";
import TextInput from "../../components/Inputs/TextInput";
import { login } from "../../api/login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import type { User } from "../../types";

type LogInProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  logIn: Login;
  setLogIn: React.Dispatch<React.SetStateAction<Login>>;
};

const LogIn = ({ logIn, setLogIn }: LogInProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = { userName: logIn.userName, password: logIn.password };
      const res = await login(payload);
      const user = res?.data?.user;
      const active = user?.activeCompanies || [];
      const selected = user?.selectedCompany;

      setUser(res.data.user as User);
      if (selected) {
        navigate("/home");
      } else if (active.length > 1) {
        navigate("/company-picker");
      } else if (active.length === 0 && (user?.inactiveCompanies || []).length > 0) {
        navigate("/company-picker");
      } else {
        navigate("/company-setup");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "ההתחברות נכשלה. אנא בדוק את פרטי החיבור.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
          התחברות למערכת
        </Typography>
        <Typography variant="body2" color="text.secondary">
          הזן את שם המשתמש והסיסמה שלך כדי להיכנס
        </Typography>
      </Box>

      <StyledForm onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}>
          {Object.values(LoginFields).map((value) => (
            <TextInput
              key={value}
              label={LogInFieldsHebNames[value]}
              type={value === LoginFields.PASSWORD ? "password" : "text"}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
              state={logIn[value as keyof Login] as string}
              setState={(str) =>
                setLogIn((prev) => ({
                  ...prev,
                  [value]: str,
                }))
              }
            />
          ))}
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: "100%", borderRadius: "12px", py: 0.5 }}>
            {error}
          </Alert>
        )}

        <ActionButton
          variant="contained"
          type="submit"
          disabled={loading}
          fullWidth
          sx={{
            mt: 1,
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "#ffffff",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "התחבר למערכת"}
        </ActionButton>
      </StyledForm>
    </Box>
  );
};

export default LogIn;
