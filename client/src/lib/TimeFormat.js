const TimeFormat = (minute) => {
    const hours = Math.floor(minute /60);
    const minutesReminder = minute % 60;
    return `${hours}h ${minutesReminder}m`;
}
export default TimeFormat;