import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";

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
}));
