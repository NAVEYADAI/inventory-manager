import { useEffect, useState } from 'react';
import axios from 'axios';

export const useHolidays = () => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    axios
      .get(`https://www.hebcal.com/hebcal/?v=1&cfg=json&year=${new Date().getFullYear()}&month=x&maj=on&min=on&mod=on&nx=on&ss=on&mf=on&c=on&s=on`)
      .then(res => {
        const evs = res.data.items.filter((i: { category: string; }) => i.category === 'holiday');
        setHolidays(evs);
      });
  }, []);

  return holidays;
};
