import React, { useState } from "react";
import { Box, Tooltip, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, useTheme, useMediaQuery, Typography, Button } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { logout as apiLogout } from "../../api/login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
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

    const navItems = [
        { label: "ראשי", path: "/home" },
        { label: "מתכונים", path: "/recipes" },
        { label: "לוח שנה", path: "/calendar2" },
        { label: "דוחות ייצור", path: "/tags" },
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
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "#1e3c72" }}>
                                    שלום, {user.name || user.email}
                                </Typography>
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
                    /* Navigation Links and User Info */
                    <Box display="flex" alignItems="center" gap={3}>
                        {/* Navigation Buttons */}
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

                        {/* User Section (Name & Logout) */}
                        <UserSection>
                            <UsernameText
                                variant="body2"
                            >
                                שלום, {user.name || user.email}
                            </UsernameText>

                            <Tooltip title="התנתק מהמערכת">
                                <LogoutButton
                                    onClick={handleLogout}
                                    size="small"
                                >
                                    <LogoutIcon fontSize="small" />
                                </LogoutButton>
                            </Tooltip>
                        </UserSection>
                    </Box>
                )}
            </StyledToolbar>
        </StyledAppBar>
    );
};

export default Navbar;