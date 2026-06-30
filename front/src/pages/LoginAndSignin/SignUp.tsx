import { Typography, Box, Alert, CircularProgress, Grid } from "@mui/material";
import { StyledForm, ActionButton, LoginFormContainer, FormHeader, LogoImage } from "./LoginAndSignin.style";
import TextInput from "../../components/Inputs/TextInput";
import { SignUpFields, SignUpFieldsHebNames, type Signup } from "./util";
import { register, login } from "../../api/login";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

import { useNotification } from "../../providers/NotificationProvider/NotificationProvider";

type SignUpProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  signUp: Signup;
  setSignUp: React.Dispatch<React.SetStateAction<Signup>>;
};

const SignUp = ({ setIsLogin, signUp, setSignUp }: SignUpProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        name: signUp.userName,
        firstName: signUp.firstName,
        lastName: signUp.lastName,
        address: signUp.address,
        phone: signUp.phone,
        email: signUp.email,
        password: String(signUp.password),
      };
      const res = await register(payload);
      if (res.status === 201 || res.status === 200) {
        // Automatically log in to set the JWT token in localStorage
        const loginRes = await login({ userName: signUp.userName, password: String(signUp.password) });
        setIsLogin(true);
        setUser(loginRes.data.user);
        showSuccess(`המשתמש ${signUp.firstName || signUp.userName} נרשם והתחבר בהצלחה!`);
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "ההרשמה נכשלה. אנא מלא את כל השדות בצורה תקינה.";
      setError(errMsg);
      showError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  const renderField = (field: SignUpFields, xsWidth: number) => (
    <Grid size={{ xs: xsWidth }} key={field}>
      <TextInput
        label={SignUpFieldsHebNames[field]}
        type={field === SignUpFields.PASSWORD ? "password" : "text"}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
          },
        }}
        state={signUp[field as keyof Signup] as string}
        setState={(str) =>
          setSignUp((prev) => ({
            ...prev,
            [field]: str,
          }))
        }
      />
    </Grid>
  );

  return (
    <LoginFormContainer>
      <FormHeader>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
          <LogoImage src="/logo.png" alt="KitchenIQ Logo" />
        </Box>
        <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
          יצירת חשבון חדש
        </Typography>
        <Typography variant="body2" color="text.secondary">
          הצטרף אלינו והתחל לנהל את המלאי שלך בצורה חכמה
        </Typography>
      </FormHeader>

      <StyledForm onSubmit={handleSubmit}>
        <Grid container spacing={1.5} sx={{ width: "100%" }}>
          {/* Row 1: First Name & Last Name */}
          {renderField(SignUpFields.FIRST_NAME, 6)}
          {renderField(SignUpFields.LAST_NAME, 6)}

          {/* Row 2: User Name & Phone */}
          {renderField(SignUpFields.USER_NAME, 6)}
          {renderField(SignUpFields.PHONE, 6)}

          {/* Row 3: Email (Full Width) */}
          {renderField(SignUpFields.EMAIL, 12)}

          {/* Row 4: Address (Full Width) */}
          {renderField(SignUpFields.ADDRESS, 12)}

          {/* Row 5: Password (Full Width) */}
          {renderField(SignUpFields.PASSWORD, 12)}
        </Grid>

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
            mt: 0.5,
            background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
            color: "#ffffff",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "הרשמה למערכת"}
        </ActionButton>
      </StyledForm>

      {/* Mobile-only login toggle */}
      <Box sx={{ display: { xs: "block", md: "none" }, textAlign: "center", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          כבר יש לך חשבון?{" "}
          <Typography
            component="span"
            variant="body2"
            color="primary"
            fontWeight={700}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => setIsLogin(true)}
          >
            להתחברות לחץ כאן
          </Typography>
        </Typography>
      </Box>
    </LoginFormContainer>
  );
};

export default SignUp;
