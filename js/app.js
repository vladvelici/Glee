var GetStarted = flight.component(function() {

    this.get_answers = function() {
        answers = [];
        for (var ansId in localStorage) {
            if (localStorage.propertyIsEnumerable(ansId) &&
                    localStorage.hasOwnProperty(ansId)) {

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
        // listen to clicks
        this.on("click", function() {
            this.trigger(document, "ui-start-request", {src: "init-button"});
        });

        // hide button on ui-start-request
        this.on(document, "ui-start-request", function(e, data) {
            this.node.remove();
            GetStarted.teardownAll();
        });

        // test if there is something in LocalStorage
        if (localStorage.length !== 0) {
            answers = this.get_answers();
            if (answers.length > 0) {
                this.trigger(document, "ui-start-request", {
                    src: "local-storage",
                    answers: answers
                });
            }
        }
    });
});


var AnswerFactory = flight.component(function() {
    
    this.answer_form = function() {
        var f = document.createElement("form");
        var input = document.createElement("input");
        input.type = "text";
        f.className = "answer-form";
        f.appendChild(input);
        return f;
    };

    this.answer_box = function() {
        var box = document.createElement("div");
        box.className="answerbox";
        return box;
    };

    this.after("initialize", function() {
        this.on(document, "ui-start-request", function(e, data) {
            var box = this.answer_box();
            var form = this.answer_form();

            this.node.appendChild(box);
            this.node.appendChild(form);

            AnswerForm.attachTo(form);
            AnswerBox.attachTo(box);


            if (data.answers) {
                this.trigger("previous-answers", {"answers":data.answers});
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

    });

});

var AnswerForm = flight.component(function() {
    
    this.after("initialize", function() {
        this.on("submit", function(e) {
            e.preventDefault();
            
            var input = this.node.childNodes[0];
            var text = input.value;

            input.value = "";
            this.trigger("add-new-answer", {"text": text, "date": new Date(), "id": uuid()});
        });
    });

});

var AnswerBox = flight.component(function() {
    this.after("initialize", function() {
        // listen to parent, as events do not get pushed down the stack
        // but get pushed up
        this.on(this.node.parentNode, "add-new-answer", function(e,answer) {
            var dom = document.createElement("article");
            this.node.appendChild(dom);
            Answer.attachTo(dom, answer);
        });

        this.on(this.node.parentNode, "previous-answers", function(e, answers) {
            for (var i in answers.answers) {
                var ans = answers.answers[i];
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
        
        this.node.className = "answer";
        var p = document.createElement("p");
        p.appendChild(document.createTextNode(this.attr.text));
        this.node.appendChild(p);

        var date = document.createElement("span");
        date.appendChild(document.createTextNode(this.attr.date));
        this.node.appendChild(date);

        var rmvLink = document.createElement("a");
        rmvLink.href = "javascript:void(0);";
        rmvLink.appendChild(document.createTextNode("remove"));
       
        this.node.appendChild(rmvLink); 
        this.attach_remove_event(rmvLink);

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
    GetStarted.attachTo("#start");
});
