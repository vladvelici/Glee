// Format a date into something nice for the user
// @param d Date object
// @return User-friendly string representation.
function format_time(d) {
    var now = new Date();

    // if this month
    if (now.getFullYear() == d.getFullYear() &&
        now.getMonth() == d.getMonth()) {
        
        var days_ago = now.getDate() - d.getDate();
    
        // if today
        if (days_ago === 0) {
            return d.getHours() + ":" + twoChars(d.getMinutes())
        }

        // if yesterday
        if (days_ago === 1) {
            return "yesterday " + d.getHours() + ":" + twoChars(d.getMinutes())
        }
        
        // this week
        return getWeekday(d.getDay()) + " " + d.getHours() + ":" + twoChars(d.getMinutes())
    }

    // Don't include same year
    if (now.getFullYear() == d.getFullYear()) {
        return d.getDate() + " " + getMonth[d.getMonth()] + " " + d.getHours() + " " + twoChars(d.getMinutes())
    }

    // Return full date
    return d.getDate() + " " + getMonth[d.getMonth()] + " " + d.getFullYear() + " " + d.getHours() + " " + twoChars(d.getMinutes())
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
