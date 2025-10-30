import { format, isToday, isYesterday } from "date-fns";

export const formatDate = (date: Date, type: "card" | "message") => {
    if (type === "card") {
        if (isToday(date)) {
            return format(date, "'Today at' h:mm a");
        }
        return format(date, "MMM d, yyyy 'at' h:mm a");
    }

    // type === "message"
    if (isToday(date)) {
        return format(date, "HH:mm");
    }
    if (isYesterday(date)) {
        return "Yesterday";
    }
    return format(date, "dd-MM-yyyy");
}
