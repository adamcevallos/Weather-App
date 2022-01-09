// Used for daily forecast labelling

const daysOfWeek = new Map([
    [0,"Sunday"],
    [1,"Monday"],
    [2,"Tuesday"],
    [3,"Wednesday"],
    [4,"Thursday"],
    [5,"Friday"],
    [6,"Saturday"],
])

function twentyFourTimeToTwelve(time) {

    time = time.toString();
    let split = time.split(":");
    let hour = split[0];
    let minutes = split[1] || '';

    if (hour == 0) hour = "12";
    let hourInt = parseInt(hour);
    let suffix = (hourInt >= 12) ? "PM" : "AM";
    if (hourInt > 12) hourInt -= 12;

    if (minutes) {
        return hourInt.toString() + ':' + minutes + suffix;
    } else {
        return hourInt.toString() + suffix;
    }
    
}

// converts unix timestamp to 24 hour time format

function unixToTimestamp(time) {
    let date = new Date(time * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
}

// converts degree to direction
// http://snowfence.umn.edu/Components/winddirectionanddegrees.htm

function degreeToDirection(degree) {

    if (degree < 0 || degree > 360) {
        throw new Error("Invalid degrees");
    }

    switch (true) {
        case (degree <= 360 || degree < 11.25):
            return "N";
        case (11.25 <= degree < 33.75):
            return "NNE";
        case (33.75 <= degree < 56.25):
            return "NE";
        case (56.25 <= degree < 78.75):
            return "ENE";
        case (78.75 <= degree < 101.25):
            return "E";
        case (101.25 <= degree < 123.75):
            return "ESE";
        case (123.75 <= degree < 146.25):
            return "SE";
        case (146.25 <= degree < 168.75):
            return "SSE";
        case (168.75 <= degree < 191.25):
            return "S";
        case (191.25 <= degree < 213.75):
            return "SSW";
        case (213.75 <= degree < 236.25):
            return "SW";
        case (236.25 <= degree < 258.75):
            return "WSW";
        case (258.75 <= degree < 281.25):
            return "W";
        case (281.25 <= degree < 303.75):
            return "WNW";
        case (303.75 <= degree < 326.25):
            return "NW";
        case (326.25 <= degree < 348.75):
            return "NNW";
    }

    return "Not Found";
}

export {
    daysOfWeek,
    unixToTimestamp,
    degreeToDirection,
    twentyFourTimeToTwelve
}