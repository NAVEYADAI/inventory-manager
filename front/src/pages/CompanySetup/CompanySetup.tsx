import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, CircularProgress, Grid, Stack } from "@mui/material";
import {
  PageBackground,
  GlassCard,
  BannerSide,
  FormSide,
  StyledForm,
} from "../LoginAndSignin/LoginAndSignin.style";
import {
  BannerTitle,
  BannerDescription,
  FormContainer,
  FormHeader,
  FormGridContainer,
  StyledTextInput,
  ErrorAlert,
  SubmitButton,
} from "./CompanySetup.style";
import { createCompany } from "../../api/company";
import { selectSubscription } from "../../api/subscription";
import { useAuth } from "../../providers/AuthProvider";
import { useNotification } from "../../providers/NotificationProvider/NotificationProvider";

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
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
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
        const subId = res.data.subscription.id;
        const selectRes = await selectSubscription(subId);
        const existingUser = user ? { ...user } : {};
        existingUser.selectedCompany = selectRes.data.selectedCompany;
        existingUser.activeCompanies = [
          ...(existingUser.activeCompanies || []),
          selectRes.data.selectedCompany
        ];
        localStorage.setItem("user", JSON.stringify(existingUser));
        if (selectRes.data.accessToken) {
          localStorage.setItem("token", selectRes.data.accessToken);
        }
        setUser(existingUser);
        showSuccess(`חברת ${res.data.company.name} נוצרה בהצלחה!`);
      }
      navigate("/home");
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "יצירת החברה נכשלה. אנא נסה שוב.";
      setError(errMsg);
      showError(errMsg);
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
            <BannerTitle variant="h3" fontWeight={800}>
              הגדרת העסק שלך
            </BannerTitle>
            <BannerDescription variant="body1">
              הזן את פרטי החברה כדי להקים את העסק שלך במערכת ולהתחיל לנהל מלאי, מתכונים ויומן עבודה בצורה חכמה.
            </BannerDescription>
          </Stack>
        </BannerSide>

        {/* Form Section */}
        <FormSide>
          <FormContainer>
            <FormHeader>
              <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
                יצירת חברה חדשה
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מלא את הפרטים הבאים כדי להשלים את ההגדרה
              </Typography>
            </FormHeader>

            <StyledForm onSubmit={handleSubmit}>
              <FormGridContainer container spacing={2}>
                {/* Row 1: Company Name & Identifier */}
                <Grid size={{ xs: 6 }}>
                  <StyledTextInput
                    label="שם החברה"
                    state={company.name}
                    setState={(str) => setCompany((c) => ({ ...c, name: str }))}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <StyledTextInput
                    label="ח.פ. / מזהה חברה"
                    state={company.identifier}
                    setState={(str) => setCompany((c) => ({ ...c, identifier: str }))}
                  />
                </Grid>

                {/* Row 2: Address (Full Width) */}
                <Grid size={{ xs: 12 }}>
                  <StyledTextInput
                    label="כתובת החברה"
                    state={company.address}
                    setState={(str) => setCompany((c) => ({ ...c, address: str }))}
                  />
                </Grid>

                {/* Row 3: Phone (Full Width) */}
                <Grid size={{ xs: 12 }}>
                  <StyledTextInput
                    label="טלפון ליצירת קשר"
                    state={company.phone}
                    setState={(str) => setCompany((c) => ({ ...c, phone: str }))}
                  />
                </Grid>
              </FormGridContainer>

              {error && (
                <ErrorAlert severity="error">
                  {error}
                </ErrorAlert>
              )}

              <SubmitButton
                variant="contained"
                type="submit"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "צור חברה והמשך"}
              </SubmitButton>
            </StyledForm>
          </FormContainer>
        </FormSide>
      </GlassCard>
    </PageBackground>
  );
};

export default CompanySetup;
