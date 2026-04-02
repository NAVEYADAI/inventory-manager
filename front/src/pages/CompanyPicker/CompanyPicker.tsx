import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  activateSubscription,
  listMySubscriptions,
  selectSubscription,
} from "../../api/subscription";
import type { CompanyInfo } from "../../api/login";

const CompanyPicker = () => {
  const [active, setActive] = useState<CompanyInfo[]>([]);
  const [inactive, setInactive] = useState<CompanyInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If user info was stored in localStorage from login, use that first
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.activeCompanies) setActive(user.activeCompanies);
        if (user.inactiveCompanies) setInactive(user.inactiveCompanies);
      } catch {}
    }

    // if neither list provided or to refresh, fetch from backend
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
        // update localStorage so possible already-stored values reflect server state
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
    // auto-select when exactly one active company
    if (active.length === 1) {
      handlePick(active[0].subscriptionId);
    }
    // if no active and no inactive, send to company creation
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
      // move this company to active
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
      setError(e?.response?.data?.message || "Activation failed");
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
      setError(e?.response?.data?.message || "Selection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Select a Company
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      {active.length > 1 && (
        <>
          <Typography variant="h6">Active Companies</Typography>
          <List>
            {active.map((c) => (
              <ListItem key={c.subscriptionId} sx={{ justifyContent: 'space-between' }}>
                {c.name}
                <Button onClick={() => handlePick(c.subscriptionId)} disabled={loading}>
                  Use
                </Button>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {active.length === 0 && inactive.length > 0 && (
        <>
          <Typography variant="h6">Inactive Companies (activate one)</Typography>
          <List>
            {inactive.map((c) => (
              <ListItem key={c.subscriptionId} sx={{ justifyContent: 'space-between' }}>
                {c.name}
                <Button onClick={() => handleActivate(c.subscriptionId)} disabled={loading}>
                  Activate
                </Button>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default CompanyPicker;
