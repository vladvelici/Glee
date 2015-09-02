// Format a date into something nice for the user
// In the future some library might be used for better date representations,
// but for now this function is more than enough.
//
// @param d Date object
// @return User-friendly string representation.
function format_time(d) {

    // if today
    if (isToday(d)) {
        return d.getHours() + ":" + twoChars(d.getMinutes())
    }

    // if yesterday
    if (isYesterday(d)) {
        return "yesterday " + d.getHours() + ":" + twoChars(d.getMinutes())
    }

    // Don't include same year
    var now = new Date();
    if (now.getFullYear() == d.getFullYear()) {
        return d.getDate() + " " + getMonth(d.getMonth()) + " " + d.getHours() + ":" + twoChars(d.getMinutes())
    }

    // Return full date
    return d.getDate() + " " + getMonth[d.getMonth()] + " " + d.getFullYear() + " " + d.getHours() + ":" + twoChars(d.getMinutes())
}

var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Saturday"];

var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
             "Oct", "Nov", "Dec"];

function getWeekday(index) {
    return weekday[index];
}

function getMonth(index) {
    return month[index];
}

function twoChars(input) {
    input = input.toString();
    if (input.length >= 2) {
        return input
    }
    return "0" + input
}

// Checks day, month and year of the given dates
function sameDate(a, b) {
    return a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
}

function isToday(d) {
    return sameDate(d, new Date());
}

function isYesterday(d) {
    var y = new Date();
    y.setDate(y.getDate() - 1);
    return sameDate(d, y);
}

// Get the day of the week that contains a date.
// @param day Day of the week, as given by new Date().getDay();
// @param contains Week that contains this date, as Date() object.
function getDay(day, contains, startDay) {

    if (startDay === undefined) {
        startDay = 0;
    }

    var offset = function(x) {
        return (x+(7-startDay)) % 7;
    };

    var res = new Date(contains);
    day = day%7;

    // dummy yesterday loop, handles months and years perfectly
    while (offset(res.getDay()) > day) {
        res.setDate(res.getDate() - 1);
    }

    // dummy tomorrow
    while (offset(res.getDay()) < day) {
        res.setDate(res.getDate() + 1);
    }

    return res;
}
