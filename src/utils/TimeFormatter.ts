const formatTime = (timeString: string): string => {
  const isoDate = new Date(timeString);
  const hours = isoDate.getUTCHours();
  const minutes = isoDate.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  let formattedHours = hours % 12;
  formattedHours = formattedHours ? formattedHours : 12;
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

function formatDateForPicker(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatTimeForPicker(date: Date): string {
  const localTime = new Date(date.getTime()).toISOString();
  return localTime.split("T")[1].slice(0, 5);
}
function formatDateTime(date: string, time: string) {
  const formattedDateTime = date + " " + time;

  return formattedDateTime;
}

export { formatTime, formatDateForPicker, formatTimeForPicker, formatDateTime };
