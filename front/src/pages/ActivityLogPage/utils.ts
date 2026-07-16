export const actionLabels: Record<string, { label: string; color: string }> = {
  CREATE_RECIPE: { label: 'יצירת מתכון', color: '#10b981' },
  UPDATE_RECIPE: { label: 'עדכון מתכון', color: '#3b82f6' },
  DELETE_RECIPE: { label: 'מחיקת מתכון', color: '#ef4444' },
  CREATE_RAW_MATERIAL_BULK: { label: 'הוספת חומרי גלם', color: '#059669' },
  UPDATE_RAW_MATERIAL: { label: 'עדכון חומר גלם', color: '#2563eb' },
  DELETE_RAW_MATERIAL: { label: 'מחיקת חומר גלם', color: '#dc2626' },
  ADD_RAW_MATERIAL_CONVERSION: { label: 'הוספת המרה', color: '#8b5cf6' },
  EXECUTE_RECIPE: { label: 'ביצוע הכנה', color: '#10b981' },
  UPDATE_EXECUTION_YIELD: { label: 'השלמת כמות', color: '#3b82f6' },
  DELETE_EXECUTION: { label: 'מחיקת הכנה', color: '#f59e0b' },
  REGISTER_EMPLOYEE: { label: 'רישום עובד', color: '#7c3aed' },
  UPDATE_EMPLOYEE_ROLE: { label: 'עדכון תפקיד', color: '#ea580c' },
  REMOVE_EMPLOYEE: { label: 'הסרת עובד', color: '#b91c1c' },
};

export enum LogCategoryFilter {
  ALL = 'all',
  WORK_MANAGEMENT = 'work_management',
  EMPLOYEE_MANAGEMENT = 'employee_management',
}
