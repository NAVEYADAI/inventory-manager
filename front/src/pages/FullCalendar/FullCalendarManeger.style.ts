import { styled } from "@mui/material/styles";
import { Box, Paper, Typography, Fab } from "@mui/material";

export const CalendarContainer = styled(Box)(({ theme }) => ({
  padding: "32px",
  maxWidth: "1200px",
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

export const CalendarHeader = styled(Paper)(({ theme }) => ({
  padding: "24px",
  marginBottom: "32px",
  borderRadius: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "16px",
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #673ab7 100%)",
  color: "#ffffff",
  boxShadow: "0 4px 20px rgba(79, 70, 229, 0.15)",
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
    flexDirection: "column",
    alignItems: "stretch",
    textAlign: "center",
  },
}));

export const CalendarCard = styled(Paper)(({ theme }) => ({
  padding: "24px",
  borderRadius: "24px",
  backgroundColor: "background.paper",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
  border: "1px solid #e2e8f0",
  [theme.breakpoints.down("sm")]: {
    padding: "12px",
    "& .fc-header-toolbar": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "8px",
    },
    "& .fc-toolbar-title": {
      fontSize: "1.1rem !important",
      textAlign: "center",
    },
    "& .fc-button": {
      padding: "4px 8px !important",
      fontSize: "0.75rem !important",
    },
    "& .fc-col-header-cell-cushion": {
      fontSize: "0.75rem !important",
    },
    "& .fc-daygrid-day-number": {
      fontSize: "0.75rem !important",
    },
    "& .fc-event": {
      fontSize: "0.7rem !important",
      padding: "2px 4px !important",
    }
  },
  // Custom CSS Overrides for FullCalendar
  "& .fc": {
    fontFamily: '"Outfit", "Rubik", "Inter", sans-serif',
    color: "#1e293b",
  },
  "& .fc-header-toolbar": {
    marginBottom: "24px !important",
    padding: "4px",
    flexWrap: "wrap",
    gap: "12px",
  },
  "& .fc-toolbar-title": {
    fontSize: "1.5rem !important",
    fontWeight: "800 !important",
    color: "#0f172a",
  },
  "& .fc-button": {
    backgroundColor: "#ffffff !important",
    border: "1px solid #e2e8f0 !important",
    color: "#475569 !important",
    fontWeight: "600 !important",
    fontSize: "0.875rem !important",
    padding: "8px 16px !important",
    borderRadius: "10px !important",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05) !important",
    transition: "all 0.2s ease-in-out !important",
    textTransform: "none !important",
  },
  "& .fc-button:hover": {
    backgroundColor: "#f8fafc !important",
    borderColor: "#cbd5e1 !important",
    color: "#0f172a !important",
    transform: "translateY(-1px)",
  },
  "& .fc-button-primary:not(:disabled).fc-button-active, & .fc-button-primary:not(:disabled):active": {
    backgroundColor: "#f1f5f9 !important",
    borderColor: "#cbd5e1 !important",
    color: "#0f172a !important",
    fontWeight: "700 !important",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02) !important",
  },
  "& .fc-today-button": {
    backgroundColor: "#eff6ff !important",
    borderColor: "#bfdbfe !important",
    color: "#2563eb !important",
  },
  "& .fc-today-button:hover": {
    backgroundColor: "#dbeafe !important",
    borderColor: "#93c5fd !important",
  },
  "& .fc-theme-standard td, & .fc-theme-standard th": {
    borderColor: "#f1f5f9 !important", // Soft grid lines
  },
  "& .fc-scrollgrid": {
    border: "1px solid #e2e8f0 !important",
    borderRadius: "16px",
    overflow: "hidden",
  },
  "& .fc-col-header": {
    backgroundColor: "#f8fafc",
  },
  "& .fc-col-header-cell-cushion": {
    padding: "12px 4px !important",
    color: "#475569 !important",
    fontWeight: "700 !important",
    fontSize: "0.9rem !important",
    textDecoration: "none !important",
  },
  "& .fc-daygrid-day": {
    transition: "background-color 0.2s ease !important",
  },
  "& .fc-daygrid-day:hover": {
    backgroundColor: "#f8fafc !important",
  },
  "& .fc-day-today": {
    backgroundColor: "#f0fdf4 !important", // Soft light green for today
  },
  "& .fc-daygrid-day-number": {
    padding: "4px !important",
    textDecoration: "none !important",
    color: "inherit !important",
    display: "block !important",
    width: "100%",
  },
  "& .fc-event": {
    borderRadius: "6px !important",
    padding: "4px 8px !important",
    margin: "2px 4px !important",
    fontSize: "0.78rem !important",
    fontWeight: "600 !important",
    border: "none !important",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05) !important",
    transition: "transform 0.15s ease, box-shadow 0.15s ease !important",
  },
  "& .fc-event:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1) !important",
    cursor: "pointer",
  },
  // TimeGrid (Week & Day Views) Overrides
  "& .fc-timegrid": {
    borderRadius: "16px",
  },
  "& .fc-timegrid-axis-cushion, & .fc-timegrid-slot-label-cushion": {
    color: "#64748b !important",
    fontSize: "0.8rem !important",
    fontWeight: "600 !important",
  },
  "& .fc-timegrid-slot": {
    height: "2.4em !important",
  },
  "& .fc-timegrid-slot-label": {
    verticalAlign: "middle !important",
  },
  "& .fc-timegrid-allday": {
    backgroundColor: "#f8fafc !important",
    borderBottom: "2px solid #e2e8f0 !important",
    padding: "6px 0 !important",
  },
  "& .fc-timegrid-allday-axis": {
    color: "#475569 !important",
    fontWeight: "700 !important",
    fontSize: "0.85rem !important",
    padding: "8px 4px !important",
  },
  "& .fc-timegrid-divider": {
    padding: "0 !important",
    backgroundColor: "#cbd5e1 !important",
  },
  "& .fc-timegrid-event": {
    borderRadius: "8px !important",
    padding: "4px 8px !important",
    fontSize: "0.8rem !important",
    fontWeight: "600 !important",
    boxShadow: "0 2px 4px rgba(0,0,0,0.06) !important",
  },
  "& .fc-v-event": {
    border: "none !important",
    borderRadius: "8px !important",
  },
  "& .fc-col-header-cell": {
    verticalAlign: "middle !important",
  },
}));

export const MonthHeaderTitle = styled(Typography)(() => ({
  fontWeight: 700,
  paddingTop: "6px",
  paddingBottom: "6px",
  color: "#475569",
}));

export const HeaderCellContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: "6px",
  paddingBottom: "6px",
  paddingLeft: "4px",
  paddingRight: "4px",
  width: "100%",
}));

export const HeaderDayName = styled(Typography)<{ isToday?: boolean }>(({ isToday }) => ({
  fontWeight: 700,
  color: isToday ? "#1976d2" : "#64748b",
  fontSize: "0.82rem",
}));

export const HeaderDayNumber = styled(Box)<{ isToday?: boolean }>(({ isToday }) => ({
  marginTop: "2px",
  marginBottom: "2px",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isToday ? "#10b981" : "transparent",
  color: isToday ? "#ffffff" : "#1e293b",
  fontWeight: 700,
  fontSize: "0.9rem",
  boxShadow: isToday ? "0 2px 6px rgba(16, 185, 129, 0.3)" : "none",
}));

export const HeaderHebrewBadge = styled(Typography)<{ isToday?: boolean }>(({ isToday }) => ({
  fontSize: "0.72rem",
  fontWeight: 600,
  color: isToday ? "#059669" : "#7c3aed",
  backgroundColor: isToday ? "rgba(16, 185, 129, 0.1)" : "rgba(124, 58, 237, 0.08)",
  padding: "1.6px 6.4px",
  borderRadius: "6px",
  marginTop: "2px",
  whiteSpace: "nowrap",
}));

export const CellContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
  gap: "4px",
  paddingRight: "12px",
  paddingTop: "4px",
}));

export const CellDayNumber = styled(Box)<{ isToday?: boolean }>(({ isToday }) => ({
  backgroundColor: isToday ? "#10b981" : "transparent",
  color: isToday ? "#ffffff" : "#1e293b",
  borderRadius: "50%",
  width: "26px",
  height: "26px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: "0.85rem",
  boxShadow: isToday ? "0 2px 4px rgba(16, 185, 129, 0.25)" : "none",
}));

export const CellHebrewText = styled(Typography)<{ isFirst?: boolean }>(({ isFirst, theme }) => ({
  fontSize: "0.72rem",
  fontWeight: isFirst ? 700 : 500,
  color: isFirst ? theme.palette.secondary.main : theme.palette.text.secondary,
  marginTop: "0.8px",
  paddingRight: "2px",
}));

export const AddTagFab = styled(Fab)(() => ({
  position: "fixed",
  bottom: 32,
  left: 32,
  background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
  boxShadow: "0 4px 16px rgba(156, 39, 176, 0.4)",
  color: "#ffffff",
  transition: "all 0.2s ease-in-out",
  zIndex: 1000,
  "&:hover": {
    background: "linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)",
    transform: "scale(1.08)",
    boxShadow: "0 6px 20px rgba(156, 39, 176, 0.5)",
  },
}));
