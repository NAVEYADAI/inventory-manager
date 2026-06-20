import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack, List, CircularProgress } from "@mui/material";
import {
  PageBackground,
  GlassCard,
  BannerSide,
  FormSide,
} from "../LoginAndSignin/LoginAndSignin.style";
import {
  HeaderIcon,
  BannerTitle,
  BannerDescription,
  FormContainer,
  FormHeader,
  ErrorAlert,
  ScrollableStack,
  SectionSubtitle,
  ActiveCompanyPaper,
  InactiveCompanyPaper,
  PickerButton,
} from "./CompanyPicker.style";
import {
  activateSubscription,
  listMySubscriptions,
  selectSubscription,
} from "../../api/subscription";
import type { CompanyInfo } from "../../api/login";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const CompanyPicker = () => {
  const [active, setActive] = useState<CompanyInfo[]>([]);
  const [inactive, setInactive] = useState<CompanyInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.activeCompanies) setActive(user.activeCompanies);
        if (user.inactiveCompanies) setInactive(user.inactiveCompanies);
      } catch {}
    }

    listMySubscriptions()
      .then((res) => {
        const subs = res.data;
        const act: CompanyInfo[] = [];
        const inact: CompanyInfo[] = [];
        subs.forEach((s) => {
          const info = {
            id: s.company.id,
            name: s.company.name,
            subscriptionId: s.id,
          };
          if (s.is_active) act.push(info);
          else inact.push(info);
        });
        setActive(act);
        setInactive(inact);
        
        const user = userStr ? JSON.parse(userStr) : {};
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, activeCompanies: act, inactiveCompanies: inact })
        );
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  useEffect(() => {
    if (active.length === 1) {
      handlePick(active[0].subscriptionId);
    }
    if (active.length === 0 && inactive.length === 0) {
      navigate("/company-setup");
    }
  }, [active, inactive]);

  const handleActivate = async (subId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await activateSubscription(subId);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const comp: CompanyInfo = res.data.selectedCompany;
      user.selectedCompany = comp;
      user.activeCompanies = [...(user.activeCompanies || []), comp];
      user.inactiveCompanies = (user.inactiveCompanies || []).filter(
        (c: CompanyInfo) => c.subscriptionId !== subId
      );
      localStorage.setItem("user", JSON.stringify(user));
      if (res.data.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
      }
      navigate("/home");
    } catch (e: any) {
      setError(e?.response?.data?.message || "הפעלת המנוי נכשלה. אנא נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  const handlePick = async (subId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await selectSubscription(subId);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.selectedCompany = res.data.selectedCompany;
      localStorage.setItem("user", JSON.stringify(user));
      if (res.data.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
      }
      navigate("/home");
    } catch (e: any) {
      setError(e?.response?.data?.message || "בחירת החברה נכשלה. אנא נסה שוב.");
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
            <HeaderIcon />
            <BannerTitle variant="h3" fontWeight={800}>
              החברות שלך
            </BannerTitle>
            <BannerDescription variant="body1">
              מקום אחד לנהל את כל העסקים שלך. בחר את החברה שברצונך לעבוד איתה כעת, או הפעל מנוי ממתין.
            </BannerDescription>
          </Stack>
        </BannerSide>

        {/* Form Section */}
        <FormSide>
          <FormContainer>
            <FormHeader>
              <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
                בחירת חברה פעילה
              </Typography>
              <Typography variant="body2" color="text.secondary">
                בחר חברה כדי להמשיך למערכת הניהול
              </Typography>
            </FormHeader>

            {error && (
              <ErrorAlert severity="error">
                {error}
              </ErrorAlert>
            )}

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <ScrollableStack spacing={3}>
                {/* Active Companies List */}
                {active.length > 1 && (
                  <Box>
                    <SectionSubtitle variant="subtitle2" fontWeight={700} color="text.secondary">
                      חברות פעילות
                    </SectionSubtitle>
                    <List disablePadding>
                      {active.map((c) => (
                        <ActiveCompanyPaper
                          key={c.subscriptionId}
                          variant="outlined"
                        >
                          <Typography variant="body1" fontWeight={600}>
                            {c.name}
                          </Typography>
                          <PickerButton
                            variant="contained"
                            size="small"
                            onClick={() => handlePick(c.subscriptionId)}
                            startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                          >
                            כניסה
                          </PickerButton>
                        </ActiveCompanyPaper>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Inactive Companies List */}
                {inactive.length > 0 && (
                  <Box>
                    <SectionSubtitle variant="subtitle2" fontWeight={700} color="text.secondary">
                      חברות ממתינות להפעלה
                    </SectionSubtitle>
                    <List disablePadding>
                      {inactive.map((c) => (
                        <InactiveCompanyPaper
                          key={c.subscriptionId}
                          variant="outlined"
                        >
                          <Typography variant="body1" fontWeight={600} color="text.secondary">
                            {c.name}
                          </Typography>
                          <PickerButton
                            variant="outlined"
                            color="warning"
                            size="small"
                            onClick={() => handleActivate(c.subscriptionId)}
                            startIcon={<PlayCircleOutlineIcon fontSize="small" />}
                          >
                            הפעלה
                          </PickerButton>
                        </InactiveCompanyPaper>
                      ))}
                    </List>
                  </Box>
                )}
              </ScrollableStack>
            )}
          </FormContainer>
        </FormSide>
      </GlassCard>
    </PageBackground>
  );
};

export default CompanyPicker;
