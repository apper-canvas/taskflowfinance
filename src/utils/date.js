import { format, isToday, isTomorrow, isYesterday, parseISO, isValid } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return "";
  
  if (isToday(parsedDate)) return "Today";
  if (isTomorrow(parsedDate)) return "Tomorrow";
  if (isYesterday(parsedDate)) return "Yesterday";
  
  return format(parsedDate, "MMM d");
};

export const formatFullDate = (date) => {
  if (!date) return "";
  
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return "";
  
  return format(parsedDate, "MMM d, yyyy");
};

export const isOverdue = (date) => {
  if (!date) return false;
  
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return false;
  
  const now = new Date();
  return parsedDate < now && !isToday(parsedDate);
};

export const isDueToday = (date) => {
  if (!date) return false;
  
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return false;
  
  return isToday(parsedDate);
};

export const isDueSoon = (date) => {
  if (!date) return false;
  
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return false;
  
  return isTomorrow(parsedDate);
};