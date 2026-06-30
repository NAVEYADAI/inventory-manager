import React, { useState } from "react";
import { Box, Tooltip, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, useTheme, useMediaQuery, Typography, Button, Chip } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { logout as apiLogout } from "../../api/login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import BusinessIcon from "@mui/icons-material/Business";
import {
  StyledAppBar,
  StyledToolbar,
  LogoImage,
  BrandTitle,
  NavButton,
  UserSection,
  UsernameText,
  LogoutButton,
} from "./navbar.style";

const Navbar: React.FC = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = useState(false);

    // If the user is not logged in, hide the navbar completely to give a clean fullscreen authentication screen
    if (!user) return null;

    const handleLogout = () => {
        apiLogout();
        setUser(undefined);
        navigate("/login");
        setDrawerOpen(false);
    };

    const isActive = (path: string) => location.pathname === path;

    const isAdmin = user?.selectedCompany?.role === 'admin' || user?.selectedCompany?.role === 'owner';

    const navItems = [
        { label: "ראשי", path: "/home" },
        { label: "מתכונים", path: "/recipes" },
        { label: "לוח שנה", path: "/calendar2" },
        { label: "דוחות ייצור", path: "/tags" },
        ...(isAdmin ? [{ label: "ניהול עובדים", path: "/employees" }] : []),
    ];

    return (
        <StyledAppBar
            position="sticky"
            elevation={0}
        >
            <StyledToolbar dir="rtl">
                {/* Logo / Brand Title with Gradient Text */}
                <Box display="flex" alignItems="center" gap={1.5}>
                    <LogoImage
                        src="/logo.png"
                        alt="Logo"
                    />
                    <BrandTitle
                        variant="h6"
                    >
                        מנהל המלאי
                    </BrandTitle>
                </Box>

                {/* Centered Navigation Links on Desktop */}
                {!isMobile && (
                    <Box display="flex" gap={1}>
                        {navItems.map((item) => (
                            <NavButton
                                key={item.path}
                                component={Link}
                                to={item.path}
                                active={isActive(item.path)}
                            >
                                {item.label}
                            </NavButton>
                        ))}
                    </Box>
                )}

                {isMobile ? (
                    <>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ color: "#1e3c72" }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="right"
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                            PaperProps={{
                                sx: {
                                    width: 250,
                                    direction: "rtl",
                                    padding: "20px",
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(10px)",
                                },
                            }}
                        >
                            <Box display="flex" flexDirection="column" height="100%">
                                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1e3c72" }}>
                                        שלום, {user.name || user.email}
                                    </Typography>
                                    {user.selectedCompany?.role && (
                                        <Chip
                                            label={
                                                user.selectedCompany.role === 'owner'
                                                    ? 'בעלים'
                                                    : user.selectedCompany.role === 'admin'
                                                    ? 'מנהל'
                                                    : 'עובד'
                                            }
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                borderRadius: '8px',
                                                color: '#ffffff',
                                                background: user.selectedCompany.role === 'owner'
                                                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                                    : user.selectedCompany.role === 'admin'
                                                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                                                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            }}
                                        />
                                    )}
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <List sx={{ flexGrow: 1 }}>
                                    {navItems.map((item) => (
                                        <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                                            <ListItemButton
                                                component={Link}
                                                to={item.path}
                                                onClick={() => setDrawerOpen(false)}
                                                selected={isActive(item.path)}
                                                sx={{
                                                    borderRadius: "10px",
                                                    color: isActive(item.path) ? "#1e3c72" : "#64748b",
                                                    backgroundColor: isActive(item.path) ? "rgba(30, 60, 114, 0.08)" : "transparent",
                                                    fontWeight: isActive(item.path) ? 700 : 500,
                                                    textAlign: "right",
                                                }}
                                            >
                                                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: "inherit" }} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                    <ListItem disablePadding sx={{ mb: 1 }}>
                                        <ListItemButton
                                            component={Link}
                                            to="/company-picker"
                                            onClick={() => setDrawerOpen(false)}
                                            sx={{
                                                borderRadius: "10px",
                                                color: "#64748b",
                                                textAlign: "right",
                                            }}
                                        >
                                            <ListItemText primary="החלף חברה / חברות שלי" />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                                <Divider sx={{ my: 2 }} />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<LogoutIcon />}
                                    onClick={handleLogout}
                                    fullWidth
                                    sx={{ borderRadius: "10px", fontWeight: 700 }}
                                >
                                    התנתק
                                </Button>
                            </Box>
                        </Drawer>
                    </>
                ) : (
                    /* User Section (Name & Logout) on Desktop */
                    <UserSection>
                        <UsernameText
                            variant="body2"
                        >
                            שלום, {user.name || user.email}
                        </UsernameText>

                        {user.selectedCompany?.role && (
                            <Chip
                                label={
                                    user.selectedCompany.role === 'owner'
                                        ? 'בעלים'
                                        : user.selectedCompany.role === 'admin'
                                        ? 'מנהל'
                                        : 'עובד'
                                }
                                size="small"
                                sx={{
                                    fontWeight: 700,
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    background: user.selectedCompany.role === 'owner'
                                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                        : user.selectedCompany.role === 'admin'
                                        ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                }}
                            />
                        )}

                        <Tooltip title="החלף חברה / חברות שלי">
                            <IconButton
                                onClick={() => navigate("/company-picker")}
                                size="small"
                                sx={{
                                    backgroundColor: "rgba(30, 60, 114, 0.08)",
                                    color: "#1e3c72",
                                    borderRadius: "10px",
                                    padding: 1,
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                        backgroundColor: "rgba(30, 60, 114, 0.15)",
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                                <BusinessIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="התנתק מהמערכת">
                            <LogoutButton
                                onClick={handleLogout}
                                size="small"
                            >
                                <LogoutIcon fontSize="small" />
                            </LogoutButton>
                        </Tooltip>
                    </UserSection>
                )}
            </StyledToolbar>
        </StyledAppBar>
    );
};

export default Navbar;