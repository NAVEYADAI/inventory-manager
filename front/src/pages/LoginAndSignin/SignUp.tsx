import { Typography, Box, Alert, CircularProgress, Grid } from "@mui/material";
import { StyledForm, ActionButton } from "./LoginAndSignin.style";
import TextInput from "../../components/Inputs/TextInput";
import { SignUpFields, SignUpFieldsHebNames, type Signup } from "./util";
import { register } from "../../api/login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

type SignUpProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  signUp: Signup;
  setSignUp: React.Dispatch<React.SetStateAction<Signup>>;
};

const SignUp = ({ setIsLogin, signUp, setSignUp }: SignUpProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

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
        setIsLogin(true);
        navigate("/company-setup");
        setUser(res.data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "ההרשמה נכשלה. אנא מלא את כל השדות בצורה תקינה.");
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
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ textAlign: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="KitchenIQ Logo"
            sx={{
              height: 90,
              width: "auto",
              filter: "drop-shadow(0px 8px 20px rgba(0, 0, 0, 0.12))",
            }}
          />
        </Box>
        <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
          יצירת חשבון חדש
        </Typography>
        <Typography variant="body2" color="text.secondary">
          הצטרף אלינו והתחל לנהל את המלאי שלך בצורה חכמה
        </Typography>
      </Box>

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
    </Box>
  );
};

export default SignUp;
