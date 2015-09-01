// Calendar widget

var Calendar = flight.component(function() {
    this.defaultAttrs({
        answerBoxNode: null
    });

    // answers is sorted, so first answer is actually the first day
    this.previous = function(e, answers) {
    };

    this.after("initialize", function() {
        this.on(this.attr.answerBoxNode, "previous-answers", this.previous);
    });
});
