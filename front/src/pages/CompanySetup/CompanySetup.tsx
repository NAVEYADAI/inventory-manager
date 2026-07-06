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
import { UI_STRINGS } from "../../constants/uiStrings";

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
              {UI_STRINGS.companySetup.bannerTitle}
            </BannerTitle>
            <BannerDescription variant="body1">
              {UI_STRINGS.companySetup.bannerDescription}
            </BannerDescription>
          </Stack>
        </BannerSide>

        {/* Form Section */}
        <FormSide>
          <FormContainer>
            <FormHeader>
              <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
                {UI_STRINGS.companySetup.formTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {UI_STRINGS.companySetup.formSubtitle}
              </Typography>
            </FormHeader>

            <StyledForm onSubmit={handleSubmit}>
              <FormGridContainer container spacing={2}>
                {/* Row 1: Company Name & Identifier */}
                <Grid size={{ xs: 6 }}>
                  <StyledTextInput
                    label={UI_STRINGS.companySetup.companyName}
                    state={company.name}
                    setState={(str) => setCompany((c) => ({ ...c, name: str }))}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <StyledTextInput
                    label={UI_STRINGS.companySetup.companyIdentifier}
                    state={company.identifier}
                    setState={(str) => setCompany((c) => ({ ...c, identifier: str }))}
                  />
                </Grid>

                {/* Row 2: Address (Full Width) */}
                <Grid size={{ xs: 12 }}>
                  <StyledTextInput
                    label={UI_STRINGS.companySetup.companyAddress}
                    state={company.address}
                    setState={(str) => setCompany((c) => ({ ...c, address: str }))}
                  />
                </Grid>

                {/* Row 3: Phone (Full Width) */}
                <Grid size={{ xs: 12 }}>
                  <StyledTextInput
                    label={UI_STRINGS.companySetup.companyPhone}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : UI_STRINGS.companySetup.submit}
              </SubmitButton>
            </StyledForm>
          </FormContainer>
        </FormSide>
      </GlassCard>
    </PageBackground>
  );
};

export default CompanySetup;
