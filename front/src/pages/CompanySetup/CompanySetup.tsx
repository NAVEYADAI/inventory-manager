import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Alert, CircularProgress, Grid, Stack } from "@mui/material";
import {
  PageBackground,
  GlassCard,
  BannerSide,
  FormSide,
  StyledForm,
  ActionButton
} from "../LoginAndSignin/LoginAndSignin.style";
import TextInput from "../../components/Inputs/TextInput";
import { createCompany } from "../../api/company";
import { useAuth } from "../../providers/AuthProvider";

interface CompanyFields {
  name: string;
  identifier: string;
  address: string;
  phone: string;
}

const CompanySetup = () => {
  const [company, setCompany] = useState<CompanyFields>({
    name: "",
    identifier: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.name.trim()) {
      setError("שם החברה הוא שדה חובה");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const payload: any = { ...company };
      if (user && user.id) {
        payload.ownerId = user.id;
      }
      const res = await createCompany(payload);
      if (res.data?.subscription) {
        const existingUser = user || {};
        localStorage.setItem("user", JSON.stringify(existingUser));
      }
      navigate("/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "יצירת החברה נכשלה. אנא נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageBackground>
      <GlassCard elevation={0} dir="rtl">
        {/* Banner Section */}
        <BannerSide>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
              הגדרת העסק שלך
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: "340px", lineHeight: 1.7, fontSize: "1.05rem" }}>
              הזן את פרטי החברה כדי להקים את העסק שלך במערכת ולהתחיל לנהל מלאי, מתכונים ויומן עבודה בצורה חכמה.
            </Typography>
          </Stack>
        </BannerSide>

        {/* Form Section */}
        <FormSide>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3.5 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
                יצירת חברה חדשה
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מלא את הפרטים הבאים כדי להשלים את ההגדרה
              </Typography>
            </Box>

            <StyledForm onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ width: "100%" }}>
                {/* Row 1: Company Name & Identifier */}
                <Grid size={{ xs: 6 }}>
                  <TextInput
                    label="שם החברה"
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                    state={company.name}
                    setState={(str) => setCompany((c) => ({ ...c, name: str }))}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextInput
                    label="ח.פ. / מזהה חברה"
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                    state={company.identifier}
                    setState={(str) => setCompany((c) => ({ ...c, identifier: str }))}
                  />
                </Grid>

                {/* Row 2: Address (Full Width) */}
                <Grid size={{ xs: 12 }}>
                  <TextInput
                    label="כתובת החברה"
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                    state={company.address}
                    setState={(str) => setCompany((c) => ({ ...c, address: str }))}
                  />
                </Grid>

                {/* Row 3: Phone (Full Width) */}
                <Grid size={{ xs: 12 }}>
                  <TextInput
                    label="טלפון ליצירת קשר"
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                    state={company.phone}
                    setState={(str) => setCompany((c) => ({ ...c, phone: str }))}
                  />
                </Grid>
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
                  mt: 1.5,
                  background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  color: "#ffffff",
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "צור חברה והמשך"}
              </ActionButton>
            </StyledForm>
          </Box>
        </FormSide>
      </GlassCard>
    </PageBackground>
  );
};

export default CompanySetup;
