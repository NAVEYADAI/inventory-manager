import { useState, useEffect, useCallback, useMemo } from "react";
import { useHolidays } from "../../../hooks/useHolidays";
import { getProductExecutions } from "../../../api/createProduct";
import { getTags, type TagDto } from "../../../api/tag";

// Categorize holidays based primarily on Hebcal's subcat field
const getEventStyle = (h: any) => {
  const subcat = h.subcat || "";
  const title = (h.title || "").toLowerCase();
  const hebrew = h.hebrew || "";

  // 1. Fasts
  if (subcat === "fast") {
    return {
      color: "#b45309",
      textColor: "#ffffff",
    };
  }

  // 2. Memorial Days
  if (
    subcat === "modern" &&
    (title.includes("zikaron") ||
      title.includes("shoah") ||
      hebrew.includes("זיכרון") ||
      hebrew.includes("שואה"))
  ) {
    return {
      color: "#475569",
      textColor: "#ffffff",
    };
  }

  // 3. Happy Holidays
  return {
    color: "#e11d48",
    textColor: "#ffffff",
  };
};

export const useCalendarEvents = (subscriptionId: number | undefined) => {
  const holidays = useHolidays();
  const [executions, setExecutions] = useState<any[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadExecutions = useCallback(async () => {
    if (!subscriptionId) return;
    try {
      const data = await getProductExecutions(subscriptionId);
      setExecutions(data);
    } catch (e) {
      console.error("Failed to load product executions", e);
    }
  }, [subscriptionId]);

  const loadTags = useCallback(async () => {
    if (!subscriptionId) return;
    try {
      const data = await getTags(subscriptionId);
      setTags(data);
    } catch (e) {
      console.error("Failed to load tags", e);
    }
  }, [subscriptionId]);

  const loadAllData = useCallback(async () => {
    if (!subscriptionId) return;
    setIsLoading(true);
    try {
      await Promise.all([loadExecutions(), loadTags()]);
    } catch (e) {
      console.error("Failed to load calendar events data", e);
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionId, loadExecutions, loadTags]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const allEvents = useMemo(() => {
    const holidayEvents = holidays.map((h: any) => {
      const style = getEventStyle(h);
      return {
        title: h.hebrew || h.title,
        date: h.date,
        allDay: true,
        color: style.color,
        textColor: style.textColor,
        display: "block",
        extendedProps: {
          isHoliday: true,
          holidayName: h.hebrew || h.title,
          holidayDate: h.date,
        },
      };
    });

    const executionEvents = executions.map((exec: any) => ({
      title: `הכנה: ${exec.recipe?.name || "מתכון לא ידוע"} (כפול ${exec.batche_count})`,
      start: exec.created_time,
      allDay: true,
      color: "#059669",
      textColor: "#ffffff",
      display: "block",
      extendedProps: {
        isRecipeExecution: true,
        execution: exec,
      },
    }));

    const tagEvents = tags
      .filter((tag: TagDto) => !tag.isHidden)
      .map((tag: TagDto) => {
        const end = new Date(tag.endDate);
        end.setDate(end.getDate() + 1);
        const endStr = end.toISOString().substring(0, 10);
        return {
          title: `📌 תג: ${tag.name}`,
          start: tag.startDate.substring(0, 10),
          end: endStr,
          allDay: true,
          color: "#9c27b0", // Purple tag color
          textColor: "#ffffff",
          display: "block",
          extendedProps: {
            isTag: true,
            tag: tag,
          },
        };
      });

    return [...holidayEvents, ...executionEvents, ...tagEvents];
  }, [holidays, executions, tags]);

  return {
    allEvents,
    isLoading,
    refreshExecutions: loadExecutions,
    refreshTags: loadTags,
    refreshAll: loadAllData,
  };
};
