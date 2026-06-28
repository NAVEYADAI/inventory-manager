import React from 'react';
import { Typography } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import type { CompanyInfo } from '../../../api/login';
import { InactiveCompanyPaper, PickerButton } from '../CompanyPicker.style';

interface InactiveCompanyItemProps {
  company: CompanyInfo;
  onActivate: (subId: number) => void;
}

const InactiveCompanyItem: React.FC<InactiveCompanyItemProps> = ({ company, onActivate }) => {
  return (
    <InactiveCompanyPaper variant="outlined">
      <Typography variant="body1" fontWeight={600} color="text.secondary">
        {company.name}
      </Typography>
      <PickerButton
        variant="outlined"
        color="warning"
        size="small"
        onClick={() => onActivate(company.subscriptionId)}
        startIcon={<PlayCircleOutlineIcon fontSize="small" />}
      >
        הפעלה
      </PickerButton>
    </InactiveCompanyPaper>
  );
};

export default InactiveCompanyItem;
