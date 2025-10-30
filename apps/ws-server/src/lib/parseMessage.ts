export const parseMessage = (message: string) => {
    try {
        return JSON.parse(message);
    } catch (err) {
        console.error("Error parsing the message");
        throw new Error("Error parsing the message");
    }
}