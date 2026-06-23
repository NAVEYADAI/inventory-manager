import React, { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Popover } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export const MONTHS = [
  { value: 0, label: "ינואר" },
  { value: 1, label: "פברואר" },
  { value: 2, label: "מרץ" },
  { value: 3, label: "אפריל" },
  { value: 4, label: "מאי" },
  { value: 5, label: "יוני" },
  { value: 6, label: "יולי" },
  { value: 7, label: "אוגוסט" },
  { value: 8, label: "ספטמבר" },
  { value: 9, label: "אוקטובר" },
  { value: 10, label: "נובמבר" },
  { value: 11, label: "דצמבר" },
];

interface MonthYearPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  selectedMonth: number;
  selectedYear: number;
  onSelect: (year: number, month: number) => void;
}

const MonthYearPopover: React.FC<MonthYearPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  selectedMonth,
  selectedYear,
  onSelect,
}) => {
  const [tempYear, setTempYear] = useState(selectedYear);

  useEffect(() => {
    if (open) {
      setTempYear(selectedYear);
    }
  }, [open, selectedYear]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      PaperProps={{
        sx: {
          p: 2.5,
          borderRadius: "20px",
          width: "280px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      <Box display="flex" flexDirection="column" gap={2} dir="rtl">
        {/* Year Selector Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton onClick={() => setTempYear((prev) => prev - 1)} size="small">
            <ChevronRightIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={800} color="text.primary">
            {tempYear}
          </Typography>
          <IconButton onClick={() => setTempYear((prev) => prev + 1)} size="small">
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        {/* Months Grid */}
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
          {MONTHS.map((m) => {
            const isSelected = m.value === selectedMonth && tempYear === selectedYear;
            return (
              <Button
                key={m.value}
                onClick={() => {
                  onSelect(tempYear, m.value);
                  onClose();
                }}
                variant={isSelected ? "contained" : "text"}
                sx={{
                  borderRadius: "10px",
                  py: 1,
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.85rem",
                  color: isSelected ? "#ffffff" : "#475569",
                  backgroundColor: isSelected ? "primary.main" : "transparent",
                  "&:hover": {
                    backgroundColor: isSelected ? "primary.dark" : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {m.label}
              </Button>
            );
          })}
        </Box>
      </Box>
    </Popover>
  );
};

export default MonthYearPopover;
