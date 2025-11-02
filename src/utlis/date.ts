export const formatDateWithRegion = (dateString: string, region?:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(region||'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}
