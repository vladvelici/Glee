
// Adds fake answers to localstorage.
function addfake() {
    var texts = [
        "For every minute you are angry you lose sixty seconds of happiness.",
        "Happiness is when what you think, what you say, and what you do are in harmony.",
        "Folks are usually as happy as they make their minds up to be.",
        "Count your age by friends, not years. Count your life by smiles, not tears.",
        "The purpose of our lives is to be happy.",
        "The more you praise and celebrate your life, the more there is in life to celebrate.",
        "The best way to cheer yourself is to try to cheer someone else up.",
        "Happiness makes up in height for what it lacks in length.",
        "I'd far rather be happy than right any day.",
        "With mirth and laughter let old wrinkles come.",
        "I’ve got nothing to do today but smile.",
        "Happiness is not the absence of problems, it’s the ability to deal with them.",
        "I must learn to be content with being happier than I deserve.",
        "Be believing, be happy, don’t get discouraged. Things will work out."
    ];

    // one date obj per answer
    var dates = [
        "2015-08-23T18:12Z",
        "2015-08-23T18:17Z",
        "2015-08-23T18:23Z",

        "2015-08-24T15:30Z",
        "2015-08-24T15:34Z",
        "2015-08-24T15:39Z",

        "2015-08-25T18:00Z",
        "2015-08-25T18:08Z",
        "2015-08-25T18:12Z",

        "2015-08-26T13:23Z",
        "2015-08-26T14:03Z",
        "2015-08-26T18:30Z",

        "2015-08-31T19:52Z",
        "2015-08-31T20:03Z",
    ];

    var j=0;

    for (var i=0;i<texts.length;i++) {
    
        var answer = {
            id: uuid(),
            date: new Date(dates[j]).getTime(),
            text: texts[i]
        };

        localStorage.setItem(answer.id, JSON.stringify(answer));

        j = Math.min(j+1, dates.length-1)
    }
}
