import React, { useState } from "react";
import {
  Box,
  Tooltip,
  Drawer,
  List,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListSubheader,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { logout as apiLogout } from "../../api/login";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BusinessIcon from "@mui/icons-material/Business";
import MenuIcon from "@mui/icons-material/Menu";
import { UI_STRINGS } from "../../constants/uiStrings";
import { AppRoutes } from "../../routes/routes.enum";
import {
  StyledAppBar,
  StyledToolbar,
  LogoImage,
  BrandTitle,
  NavButton,
  ProfileButton,
  MenuHeaderCard,
  menuPaperProps,
  DrawerListItem,
  DrawerNavButton,
  RoleChip,
  ProfileMenuItem,
  ProfileLogoutMenuItem,
  MenuDivider,
  MobileMenuButton,
  drawerPaperProps,
  DrawerHeaderCard,
  DrawerHeaderTitle,
} from "./navbar.style";

const Navbar: React.FC = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Dropdown anchors state
    const [prodAnchor, setProdAnchor] = useState<null | HTMLElement>(null);
    const [mgmtAnchor, setMgmtAnchor] = useState<null | HTMLElement>(null);
    const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);

    // If the user is not logged in, hide the navbar completely
    if (!user) return null;

    const handleLogout = () => {
        apiLogout();
        setUser(undefined);
        navigate(AppRoutes.LOGIN);
        setDrawerOpen(false);
        setUserAnchor(null);
    };

    const isActive = (path: string) => location.pathname === path;

    const isAdmin = user?.selectedCompany?.role === 'admin' || user?.selectedCompany?.role === 'owner';

    const isProductionActive = location.pathname === AppRoutes.PENDING_PREPARATIONS || location.pathname === AppRoutes.TAGS;
    const isManagementActive = location.pathname === AppRoutes.EMPLOYEES || location.pathname === AppRoutes.ACTIVITY_LOG;


    return (
        <StyledAppBar position="sticky" elevation={0}>
            <StyledToolbar dir="rtl">
                {/* Logo / Brand */}
                <Box display="flex" alignItems="center" gap={1.5}>
                    <LogoImage src="/logo.png" alt="Logo" />
                    <BrandTitle variant="h6">מנהל המלאי</BrandTitle>
                </Box>

                {/* Desktop Navigation Links */}
                {!isMobile && (
                    <Box display="flex" gap={1} alignItems="center">
                        <NavButton component={Link} to={AppRoutes.HOME} active={isActive(AppRoutes.HOME)}>
                            ראשי
                        </NavButton>
                        <NavButton component={Link} to={AppRoutes.RECIPES} active={isActive(AppRoutes.RECIPES)}>
                            מתכונים
                        </NavButton>
                        <NavButton component={Link} to={AppRoutes.CALENDAR2} active={isActive(AppRoutes.CALENDAR2)}>
                            לוח שנה
                        </NavButton>

                        {/* Production Dropdown Trigger */}
                        <NavButton
                            onClick={(e) => setProdAnchor(e.currentTarget)}
                            active={isProductionActive}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            ייצור
                        </NavButton>
                        <Menu
                            anchorEl={prodAnchor}
                            open={Boolean(prodAnchor)}
                            onClose={() => setProdAnchor(null)}
                            PaperProps={menuPaperProps}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem
                                component={Link}
                                to={AppRoutes.PENDING_PREPARATIONS}
                                onClick={() => setProdAnchor(null)}
                                selected={isActive(AppRoutes.PENDING_PREPARATIONS)}
                            >
                                השלמת הכנות
                            </MenuItem>
                            <MenuItem
                                component={Link}
                                to={AppRoutes.TAGS}
                                onClick={() => setProdAnchor(null)}
                                selected={isActive(AppRoutes.TAGS)}
                            >
                                דוחות ייצור
                            </MenuItem>
                        </Menu>

                        {/* Management Dropdown Trigger */}
                        {isAdmin && (
                            <>
                                <NavButton
                                    onClick={(e) => setMgmtAnchor(e.currentTarget)}
                                    active={isManagementActive}
                                    endIcon={<KeyboardArrowDownIcon />}
                                >
                                    ניהול
                                </NavButton>
                                <Menu
                                    anchorEl={mgmtAnchor}
                                    open={Boolean(mgmtAnchor)}
                                    onClose={() => setMgmtAnchor(null)}
                                    PaperProps={menuPaperProps}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem
                                        component={Link}
                                        to={AppRoutes.EMPLOYEES}
                                        onClick={() => setMgmtAnchor(null)}
                                        selected={isActive(AppRoutes.EMPLOYEES)}
                                    >
                                        ניהול עובדים
                                    </MenuItem>
                                    <MenuItem
                                        component={Link}
                                        to={AppRoutes.ACTIVITY_LOG}
                                        onClick={() => setMgmtAnchor(null)}
                                        selected={isActive(AppRoutes.ACTIVITY_LOG)}
                                    >
                                        יומן פעולות
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                )}

                {/* Mobile Navigation Drawer Trigger */}
                {isMobile ? (
                    <>
                        <MobileMenuButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setDrawerOpen(true)}
                        >
                            <MenuIcon />
                        </MobileMenuButton>
                        <Drawer
                            anchor="right"
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                            PaperProps={drawerPaperProps}
                        >
                            <Box display="flex" flexDirection="column" height="100%">
                                {/* User Info Card in Drawer */}
                                <DrawerHeaderCard>
                                    <DrawerHeaderTitle variant="subtitle1">
                                        {user.name || user.email}
                                    </DrawerHeaderTitle>
                                    {user.selectedCompany?.role && (
                                        <RoleChip
                                            roleType={user.selectedCompany.role}
                                            label={UI_STRINGS.roles[user.selectedCompany.role] || UI_STRINGS.roles.editor}
                                            size="small"
                                        />
                                    )}
                                </DrawerHeaderCard>
                                <Divider sx={{ mb: 2 }} />

                                {/* Drawer Navigation List */}
                                <List sx={{ flexGrow: 1 }} disablePadding>
                                    {/* Direct links */}
                                    <DrawerListItem disablePadding>
                                        <DrawerNavButton
                                            component={Link}
                                            to={AppRoutes.HOME}
                                            onClick={() => setDrawerOpen(false)}
                                            selected={isActive(AppRoutes.HOME)}
                                            active={isActive(AppRoutes.HOME)}
                                        >
                                            <ListItemText primary="ראשי" primaryTypographyProps={{ fontWeight: "inherit" }} />
                                        </DrawerNavButton>
                                    </DrawerListItem>
                                    <DrawerListItem disablePadding>
                                        <DrawerNavButton
                                            component={Link}
                                            to={AppRoutes.RECIPES}
                                            onClick={() => setDrawerOpen(false)}
                                            selected={isActive(AppRoutes.RECIPES)}
                                            active={isActive(AppRoutes.RECIPES)}
                                        >
                                            <ListItemText primary="מתכונים" primaryTypographyProps={{ fontWeight: "inherit" }} />
                                        </DrawerNavButton>
                                    </DrawerListItem>
                                    <DrawerListItem disablePadding>
                                        <DrawerNavButton
                                            component={Link}
                                            to={AppRoutes.CALENDAR2}
                                            onClick={() => setDrawerOpen(false)}
                                            selected={isActive(AppRoutes.CALENDAR2)}
                                            active={isActive(AppRoutes.CALENDAR2)}
                                        >
                                            <ListItemText primary="לוח שנה" primaryTypographyProps={{ fontWeight: "inherit" }} />
                                        </DrawerNavButton>
                                    </DrawerListItem>

                                    {/* Production Section */}
                                    <ListSubheader disableSticky sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.78rem", mt: 1.5, mb: 0.5, px: 1, backgroundColor: "transparent" }}>
                                        ייצור
                                    </ListSubheader>
                                    <DrawerListItem disablePadding>
                                        <DrawerNavButton
                                            component={Link}
                                            to={AppRoutes.PENDING_PREPARATIONS}
                                            onClick={() => setDrawerOpen(false)}
                                            selected={isActive(AppRoutes.PENDING_PREPARATIONS)}
                                            active={isActive(AppRoutes.PENDING_PREPARATIONS)}
                                        >
                                            <ListItemText primary="השלמת הכנות" primaryTypographyProps={{ fontWeight: "inherit" }} />
                                        </DrawerNavButton>
                                    </DrawerListItem>
                                    <DrawerListItem disablePadding>
                                        <DrawerNavButton
                                            component={Link}
                                            to={AppRoutes.TAGS}
                                            onClick={() => setDrawerOpen(false)}
                                            selected={isActive(AppRoutes.TAGS)}
                                            active={isActive(AppRoutes.TAGS)}
                                        >
                                            <ListItemText primary="דוחות ייצור" primaryTypographyProps={{ fontWeight: "inherit" }} />
                                        </DrawerNavButton>
                                    </DrawerListItem>

                                    {/* Management Section */}
                                    {isAdmin && (
                                        <>
                                            <ListSubheader disableSticky sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.78rem", mt: 1.5, mb: 0.5, px: 1, backgroundColor: "transparent" }}>
                                                ניהול ומערכת
                                            </ListSubheader>
                                            <DrawerListItem disablePadding>
                                                <DrawerNavButton
                                                    component={Link}
                                                    to={AppRoutes.EMPLOYEES}
                                                    onClick={() => setDrawerOpen(false)}
                                                    selected={isActive(AppRoutes.EMPLOYEES)}
                                                    active={isActive(AppRoutes.EMPLOYEES)}
                                                >
                                                    <ListItemText primary="ניהול עובדים" primaryTypographyProps={{ fontWeight: "inherit" }} />
                                                </DrawerNavButton>
                                            </DrawerListItem>
                                            <DrawerListItem disablePadding>
                                                <DrawerNavButton
                                                    component={Link}
                                                    to={AppRoutes.ACTIVITY_LOG}
                                                    onClick={() => setDrawerOpen(false)}
                                                    selected={isActive(AppRoutes.ACTIVITY_LOG)}
                                                    active={isActive(AppRoutes.ACTIVITY_LOG)}
                                                >
                                                    <ListItemText primary="יומן פעולות" primaryTypographyProps={{ fontWeight: "inherit" }} />
                                                </DrawerNavButton>
                                            </DrawerListItem>
                                        </>
                                    )}

                                    {/* Company Switcher */}
                                    <Divider sx={{ my: 1.5 }} />
                                    <DrawerListItem disablePadding>
                                        <DrawerNavButton
                                            component={Link}
                                            to={AppRoutes.COMPANY_PICKER}
                                            onClick={() => setDrawerOpen(false)}
                                        >
                                            <ListItemText primary="החלף חברה / חברות שלי" />
                                        </DrawerNavButton>
                                    </DrawerListItem>
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
                                    {UI_STRINGS.navbar.logout}
                                </Button>
                            </Box>
                        </Drawer>
                    </>
                ) : (
                    /* User Profile Dropdown on Desktop */
                    <Box>
                        <Tooltip title="פרופיל והגדרות">
                            <ProfileButton onClick={(e) => setUserAnchor(e.currentTarget)}>
                                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                            </ProfileButton>
                        </Tooltip>

                        <Menu
                            anchorEl={userAnchor}
                            open={Boolean(userAnchor)}
                            onClose={() => setUserAnchor(null)}
                            PaperProps={menuPaperProps}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {/* Rich User Info Card */}
                            <MenuHeaderCard>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#1e3c72", wordBreak: "break-all" }}>
                                    {user.name || user.email}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#64748b", mb: 0.5 }}>
                                    {user.selectedCompany?.name || "אין חברה פעילה"}
                                </Typography>
                                {user.selectedCompany?.role && (
                                    <RoleChip
                                        roleType={user.selectedCompany.role}
                                        label={UI_STRINGS.roles[user.selectedCompany.role] || UI_STRINGS.roles.editor}
                                        size="small"
                                        sx={{ borderRadius: '6px', fontSize: '0.75rem' }}
                                    />
                                )}
                            </MenuHeaderCard>

                            <ProfileMenuItem
                                component={Link}
                                to={AppRoutes.COMPANY_PICKER}
                                onClick={() => setUserAnchor(null)}
                            >
                                <BusinessIcon fontSize="small" />
                                <span>החלף חברה / חברות שלי</span>
                            </ProfileMenuItem>

                            <MenuDivider />

                            <ProfileLogoutMenuItem onClick={handleLogout}>
                                <LogoutIcon fontSize="small" />
                                <span>{UI_STRINGS.navbar.logout}</span>
                            </ProfileLogoutMenuItem>
                        </Menu>
                    </Box>
                )}
            </StyledToolbar>
        </StyledAppBar>
    );
};

export default Navbar;