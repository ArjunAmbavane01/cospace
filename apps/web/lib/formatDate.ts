import { format, isToday } from "date-fns";

export const formatDate = (date: Date) => {
    if (isToday(date)) {
        return format(date, "'Today at' h:mm a"); // Today at 3:45 PM
    }
    return format(date, "MMM d, yyyy 'at' h:mm a"); // Oct 14, 2025 at 3:45 PM
}
