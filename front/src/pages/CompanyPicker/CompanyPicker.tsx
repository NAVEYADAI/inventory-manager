import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack, Alert, List, Paper, CircularProgress, Button } from "@mui/material";
import {
  PageBackground,
  GlassCard,
  BannerSide,
  FormSide,
} from "../LoginAndSignin/LoginAndSignin.style";
import {
  activateSubscription,
  listMySubscriptions,
  selectSubscription,
} from "../../api/subscription";
import type { CompanyInfo } from "../../api/login";
import BusinessIcon from "@mui/icons-material/Business";
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
            <BusinessIcon sx={{ fontSize: 60, opacity: 0.9 }} />
            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
              החברות שלך
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: "340px", lineHeight: 1.7, fontSize: "1.05rem" }}>
              מקום אחד לנהל את כל העסקים שלך. בחר את החברה שברצונך לעבוד איתה כעת, או הפעל מנוי ממתין.
            </Typography>
          </Stack>
        </BannerSide>

        {/* Form Section */}
        <FormSide>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3.5, height: "100%", justifyContent: "center" }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
                בחירת חברה פעילה
              </Typography>
              <Typography variant="body2" color="text.secondary">
                בחר חברה כדי להמשיך למערכת הניהול
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: "12px", py: 0.5 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Stack spacing={3} sx={{ overflowY: "auto", pr: 0.5, maxHeight: "350px" }}>
                {/* Active Companies List */}
                {active.length > 1 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                      חברות פעילות
                    </Typography>
                    <List disablePadding>
                      {active.map((c) => (
                        <Paper
                          key={c.subscriptionId}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            mb: 1.5,
                            borderRadius: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            transition: "background-color 0.2s",
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            {c.name}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handlePick(c.subscriptionId)}
                            startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                            sx={{ borderRadius: "8px", fontWeight: 700, px: 2 }}
                          >
                            כניסה
                          </Button>
                        </Paper>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Inactive Companies List */}
                {inactive.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                      חברות ממתינות להפעלה
                    </Typography>
                    <List disablePadding>
                      {inactive.map((c) => (
                        <Paper
                          key={c.subscriptionId}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            mb: 1.5,
                            borderRadius: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderColor: "warning.light",
                            transition: "background-color 0.2s",
                            "&:hover": { bgcolor: "warning.lighter" },
                          }}
                        >
                          <Typography variant="body1" fontWeight={600} color="text.secondary">
                            {c.name}
                          </Typography>
                          <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            onClick={() => handleActivate(c.subscriptionId)}
                            startIcon={<PlayCircleOutlineIcon fontSize="small" />}
                            sx={{ borderRadius: "8px", fontWeight: 700, px: 2 }}
                          >
                            הפעלה
                          </Button>
                        </Paper>
                      ))}
                    </List>
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </FormSide>
      </GlassCard>
    </PageBackground>
  );
};

export default CompanyPicker;
