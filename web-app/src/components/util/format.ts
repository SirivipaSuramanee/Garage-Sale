import dayjs from "dayjs";
const dateTime = "DD MMM, YYYY HH:mm:ss"

export const formatDateTime = (Date: Date) => {
   return dayjs(Date).format('DD MMM, YYYY HH:mm:ss')
}