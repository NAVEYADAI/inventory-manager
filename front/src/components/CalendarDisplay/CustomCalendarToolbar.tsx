import React, { useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MonthYearPopover, { MONTHS } from "./MonthYearPopover";

interface CustomCalendarToolbarProps {
  selectedMonth: number;
  selectedYear: number;
  currentView: string;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  onViewChange: (viewName: string) => void;
  onDateSelect: (year: number, month: number) => void;
}

const CustomCalendarToolbar: React.FC<CustomCalendarToolbarProps> = ({
  selectedMonth,
  selectedYear,
  currentView,
  onToday,
  onPrev,
  onNext,
  onViewChange,
  onDateSelect,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTitleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3.5} dir="rtl">
      {/* Navigation Buttons (Right) */}
      <Box display="flex" gap={1} alignItems="center">
        <Button
          variant="outlined"
          onClick={onToday}
          sx={{ borderRadius: "10px", fontWeight: 700, borderColor: "#cbd5e1", color: "#475569" }}
        >
          היום
        </Button>
        <IconButton onClick={onPrev} sx={{ border: "1px solid #cbd5e1", borderRadius: "10px", p: 0.75 }}>
          <ChevronRightIcon />
        </IconButton>
        <IconButton onClick={onNext} sx={{ border: "1px solid #cbd5e1", borderRadius: "10px", p: 0.75 }}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      {/* Month/Year Title Button (Center) */}
      <Box display="flex" alignItems="center">
        <Button
          onClick={handleTitleClick}
          endIcon={<ExpandMoreIcon />}
          sx={{
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "#0f172a",
            textTransform: "none",
            borderRadius: "12px",
            px: 2,
            py: 0.5,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          {MONTHS[selectedMonth]?.label} {selectedYear}
        </Button>
        <MonthYearPopover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onSelect={onDateSelect}
        />
      </Box>

      {/* View Buttons (Left) */}
      <Box display="flex" gap={1}>
        {[
          { id: "dayGridMonth", label: "חודש" },
          { id: "timeGridWeek", label: "שבוע" },
          { id: "timeGridDay", label: "יום" },
        ].map((view) => (
          <Button
            key={view.id}
            variant={currentView === view.id ? "contained" : "outlined"}
            onClick={() => onViewChange(view.id)}
            sx={{
              borderRadius: "10px",
              fontWeight: currentView === view.id ? 700 : 500,
              borderColor: currentView === view.id ? "primary.main" : "#cbd5e1",
              color: currentView === view.id ? "#ffffff" : "#475569",
              boxShadow: currentView === view.id ? "0 4px 12px rgba(25, 118, 210, 0.15)" : "none",
            }}
          >
            {view.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default CustomCalendarToolbar;
