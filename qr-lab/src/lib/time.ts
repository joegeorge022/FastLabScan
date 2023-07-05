export function timeDifference(previous : number) {

    let current = new Date().getTime();

    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' sec ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' min ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

export const hourUp = (startTime:string) => {
        let x = startTime.split(':')

        let hour = parseInt(x[0])
        let endTime

        if (hour === 23)
            endTime = `00:` + x[1]
        else if (hour < 9)
            endTime = `0${hour + 1}:` + x[1]
        else
            endTime =`${hour + 1}:` + x[1]

        return endTime
}