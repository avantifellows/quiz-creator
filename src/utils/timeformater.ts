// const formatTime = (timeString: string): string => {
//   const time = new Date(timeString);

//   const hours = time.getHours();
//   const minutes = time.getMinutes();
//   const period = hours >= 12 ? "PM" : "AM";
//   const formattedHours = hours % 12 || 12;
//   const formattedMinutes = minutes.toString().padStart(2, "0");

//   return `${formattedHours}:${formattedMinutes} ${period}`;
// };

const formatTime = (timeString: string): string => {
  const time = new Date(timeString);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedTime = time.toLocaleString("en-IN", options);

  return formattedTime;
};

function formatDateForPicker(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatTimeForPicker(date: Date): string {
  const localTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
  return localTime.split("T")[1].slice(0, 5);
}

export { formatTime, formatDateForPicker, formatTimeForPicker };
