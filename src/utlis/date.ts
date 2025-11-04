export const formatDateWithRegion = (date: string, region?:string, withWeek=false) => {
    const dateString = new Date(date).toLocaleDateString(region||'en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        ...withWeek&&{weekday: 'short'}
    })
    const timeString = new Date(date).toLocaleTimeString(region||'en-US', {
        hour: '2-digit',
        minute: '2-digit'
    })
    return `${dateString} - ${timeString}`; 
}
