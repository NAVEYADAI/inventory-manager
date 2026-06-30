import { Typography, Box, Alert, CircularProgress } from "@mui/material";
import { StyledForm, ActionButton, LoginFormContainer, FormHeader, LogoImage, InputFieldsStack } from "./LoginAndSignin.style";
import { LoginFields, LogInFieldsHebNames, type Login } from "./util";
import TextInput from "../../components/Inputs/TextInput";
import { login } from "../../api/login";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import type { User } from "../../types";

import { useNotification } from "../../providers/NotificationProvider/NotificationProvider";

type LogInProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  logIn: Login;
  setLogIn: React.Dispatch<React.SetStateAction<Login>>;
};

const LogIn = ({ setIsLogin, logIn, setLogIn }: LogInProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = { userName: logIn.userName, password: logIn.password };
      const res = await login(payload);
      const user = res?.data?.user;

      setUser(res.data.user as User);
      showSuccess(`משתמש ${user?.name || ''} התחבר בהצלחה!`);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "ההתחברות נכשלה. אנא בדוק את פרטי החיבור.";
      setError(errMsg);
      showError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginFormContainer>
      <FormHeader>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <LogoImage src="/logo.png" alt="KitchenIQ Logo" />
        </Box>
        <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
          התחברות למערכת
        </Typography>
        <Typography variant="body2" color="text.secondary">
          הזן את שם המשתמש והסיסמה שלך כדי להיכנס
        </Typography>
      </FormHeader>

      <StyledForm onSubmit={handleSubmit}>
        <InputFieldsStack>
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
        </InputFieldsStack>

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

      {/* Mobile-only register toggle */}
      <Box sx={{ display: { xs: "block", md: "none" }, textAlign: "center", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          אין לך חשבון עדיין?{" "}
          <Typography
            component="span"
            variant="body2"
            color="primary"
            fontWeight={700}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => setIsLogin(false)}
          >
            להרשמה לחץ כאן
          </Typography>
        </Typography>
      </Box>
      </LoginFormContainer>
  );
};

export default LogIn;
