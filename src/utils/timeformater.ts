const formatTime = (timeString: string): string => {
  const time = new Date(timeString);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

function formatDateForPicker(date: Date): string {
  return date.toISOString().split("T")[0]; // Extracts the date part
}

function formatTimeForPicker(date: Date): string {
  const localTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
  return localTime.split("T")[1].slice(0, 5);
}

export { formatTime, formatDateForPicker, formatTimeForPicker };
