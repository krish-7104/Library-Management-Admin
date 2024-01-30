export const dateFormatter = (date) => {
    const tempDate = new Date(date)
    const newDate = `${tempDate.getDate()}-${tempDate.getMonth() + 1}-${tempDate.getFullYear()}`
    return newDate
}
