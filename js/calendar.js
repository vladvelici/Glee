// Calendar widget
//
// It manages the Days in the calendar view, making sure each day in the
// answers interval is represented by a Day object and view.
var Calendar = flight.component(function() {
    this.defaultAttrs({
        answerBoxNode: null
    });

    this.dayNode = function(d) {
        var node = document.createElement("time");
        node.setAttribute("datetime", d.toISOString());

        var tooltip = document.createElement("span");
        tooltip.className = "cal-tooltip";
        tooltip.appendChild(document.createTextNode(format_time(d)));
        node.appendChild(tooltip);

        return node;
    };

    this.lastDate;

    // answers is sorted, so first answer is actually the first day
    this.previous = function(e, answers) {

        answers = answers.answers;

        var first = new Date(answers[0].date);
        var last = new Date(answers[answers.length-1].date);

        var checkDate = new Date(last);
        checkDate.setDate(checkDate.getDate()+1);

        var i = 0;

        do {
            var node = this.dayNode(first);
            
            Day.attachTo(node, {
                date: new Date(first),
                answerBoxNode: this.attr.answerBoxNode
            });

            this.node.appendChild(node);

            for (;i<answers.length && sameDate(answers[i].date, first);i=i+1) {
                this.trigger(node, "calendar-add-answer", answers[i]);
            }

            first.setDate(first.getDate()+1);
        } while(!sameDate(first, checkDate));

        this.lastDate = new Date(last);
    };

    // add new answer
    this.add = function(e, answer) {
        if (this.lastDate !== null && !sameDate(answer.date, this.lastDate)) {
            // if adding in the past (weird but can happen)
            if (this.lastDate.getTime() > answer.date.getTime) {
                // Past days not yet added will not be rendered.
                //
                // Should not normally happen. Past answers are handles at
                //  "previous-answer", this.previous.
                return
            }

            console.log("Adding date.");

            var node;

            // add a few days
            do {
                this.lastDate.setDate(this.lastDate.getDate()+1);
                console.log("A: ", this.lastDate);
                node = this.dayNode(this.lastDate);
                Day.attachTo(node, {
                    date: new Date(this.lastDate),
                    answerBoxNode: this.attr.answerBoxNode
                });
                this.node.appendChild(node);
            } while(!sameDate(answer.date, this.lastDate));

            // add answer for today
            this.trigger(node, "calendar-add-answer", answer);
        } else if (this.lastDate === null) {
            this.lastDate = new Date(answer.date);
            var node = this.dayNode(this.lastDate);
            Day.attachTo(node, {
                date: new Date(answer.date),
                answerBoxNode: this.attr.answerBoxNode
            });
        }
    };

    this.after("initialize", function() {
        this.on(this.attr.answerBoxNode, "previous-answers", this.previous);
        this.on(this.attr.answerBoxNode, "add-new-answer", this.add);
        this.lastDate = null;
    });
});

var Day = flight.component(function() {
    this.defaultAttrs({
        date: null,
        answerBoxNode: null
    });

    // variables are initialized after("initialize",...)
    this.answers;
    this.ansCount;

    this.add = function(e, answer) {

        if (this.answers.hasOwnProperty(answer.id)) {
            // already have answer
            return
        }

        if (!sameDate(this.attr.date, answer.date)) {
            // not the same date
            return
        }

        this.ansCount++;
        this.answers[answer.id] = answer;
        if (this.ansCount === 1) {
            // freshly added, change class
            this.node.classList.add("with-answers");
        }
    };

    this.rm = function(e, answer) {
        var id = answer.id;

        if (this.answers.hasOwnProperty(id)) {
            this.ansCount--;
            delete this.answers[id];
            if (this.ansCount === 0) {
                this.node.classList.remove("with-answers");
            }
        }
    }

    this.after("initialize", function() {
        this.answers = {};
        this.ansCount = 0;

        this.on(this.attr.answerBoxNode, "add-new-answer", this.add);
        this.on("calendar-add-answer", this.add);
        this.on(this.attr.answerBoxNode, "remove-answer", this.rm);
    });
});
