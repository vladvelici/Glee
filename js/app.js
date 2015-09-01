var AnswerFactory = flight.component(function() {
    
    this.get_answers = function() {

        answers = [];
        for (var ansId in localStorage) {

            if (localStorage.hasOwnProperty(ansId)) {

                answer = localStorage[ansId];
                try {
                    answer = answer && JSON.parse(answer);
                } catch (e) {
                    answer = null;
                }
        
                if (answer !== null && answer !== undefined &&
                    answer.hasOwnProperty("date") &&
                    answer.hasOwnProperty("text") &&
                    answer.hasOwnProperty("id")) {

                    try {
                        var d = new Date(0);
                        d.setUTCMilliseconds(answer.date)
                        answer.date = d;
                        // have a valid answer here 
                        answers.push(answer);
                    } catch(e) {}
                }
            }
        }

        // sort by asc by date
      
        answers.sort(function(a,b) {
            return a.date.getTime() - b.date.getTime();
        });


        return answers;
    };

    this.after("initialize", function() {
        
        var answer_box = document.getElementById("answer-box");
        AnswerBox.attachTo(answer_box);
        var answer_form = document.getElementById("answer-form");
        AnswerForm.attachTo(answer_form);
       
        this.on("init-request-data", function(e) {
            if (localStorage.length !== 0) {
                answers = this.get_answers();
                if (answers.length > 0) {
                    this.trigger("previous-answers", {"answers": answers});
                }
            }
        });

        // Remove answer from localStorage
        this.on("remove-answer", function(e, answer) {
            localStorage.removeItem(answer.id);
        });

        // Store answer on localStorage
        this.on("add-new-answer", function(e, answer) {
            var obj = {
                id: answer.id,
                text: answer.text,
                date: answer.date.getTime()
            }
            localStorage.setItem(answer.id, JSON.stringify(obj));
        });
        
        this.trigger("init-request-data");
    });

});

var AnswerForm = flight.component(function() {
    
    this.after("initialize", function() {
        this.input = document.getElementById("answer-field");
        this.on("submit", function(e) {
            e.preventDefault();
            
            var text = this.input.value;
            this.input.value = "";

            this.trigger("add-new-answer", {
                "text": text,
                "date": new Date(),
                "id": uuid()}
            );
        });
    });

});

var AnswerBox = flight.component(function() {
    this.after("initialize", function() {
        // listen to parent, as events do not get pushed down the stack
        // but get pushed up
        this.on(this.node.parentNode, "add-new-answer", function(e,answer) {
            var dom = document.createElement("article");
            Answer.attachTo(dom, answer);
            this.node.appendChild(dom);
        });

        this.on(this.node.parentNode, "previous-answers", function(e, answers) {
            for (var i in answers.answers) {
                var ans = answers.answers[i];
                if (!isToday(ans.date)) {
                    // Only render today's answers
                    continue;
                }
                var dom = document.createElement("article");
                this.node.appendChild(dom);
                Answer.attachTo(dom, ans);
            }
        });
    });

});

var Answer = flight.component(function() {
    this.defaultAttrs({
        id: null,
        text: null,
        date: null
    });

    this.render = function() {
        
        this.node.style.maxHeight = "0px";
        this.node.style.marginBottom = "0em";

        this.node.className = "answer";
        var p = document.createElement("p");
        p.appendChild(document.createTextNode(this.attr.text));
        this.node.appendChild(p);

        var nav = document.createElement("nav");

        var date = document.createElement("time");
        date.setAttribute("datetime", this.attr.date.toISOString());
        var dateStr = format_time(this.attr.date);
        date.appendChild(document.createTextNode(dateStr));
        nav.appendChild(date);

        var rmvLink = document.createElement("a");
        rmvLink.href = "javascript:void(0);";
        rmvLink.appendChild(document.createTextNode("remove"));
       
        nav.appendChild(rmvLink); 
        this.attach_remove_event(rmvLink);

        this.node.appendChild(nav);

        var node = this.node;

        setTimeout(function() {
            node.style.maxHeight = "";
            node.style.marginBottom = "";
        }, 1);
    };
    
    this.remove = function(e) {
        e.preventDefault();
        this.trigger("remove-answer", {"id": this.attr.id});
        this.node.remove();
    };

    this.attach_remove_event = function(a) {
        this.on(a, "click", this.remove);
    };

    this.after("initialize", function() {
        this.render();
    });


});

window.addEventListener("load", function() {
    // Make initial attachments
    AnswerFactory.attachTo("#answers");
});
