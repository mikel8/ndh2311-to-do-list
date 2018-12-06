/*
 * @author Shaumik "Dada" Daityari
 * @copyright December 2013
 */

/* Some info
Using newer versions of jQuery and jQuery UI in place of the links given in problem statement
All data is stored in local storage
User data is extracted from local storage and saved in variable todo.data
Otherwise, comments are provided at appropriate places
*/

/* Saving Tasks in Local Storage: this application using HTML5’s local storage.
In JavaScript, the variable localStorage stores all of this data. Each task would be stored within the data variable */
var todo = todo || {},
    data = JSON.parse(localStorage.getItem("todoData"));

data = data || {};

// Defining the JavaScript Constants
(function(todo, data, $) {
// CSS selectors and attributes that would be used by the JavaScript functions
    var defaults = {
            todoTask: "todo-task",
            todoHeader: "task-header",
            todoDate: "task-date",
            todoDescription: "task-description",
            todoOwnner: "task-owner",
            taskId: "task-",
            formId: "todo-form",
            dataAttribute: "data",
            deleteDiv: "delete-div"
        }, codes = {
            "1" : "#pending", // For pending tasks
            "2" : "#inProgress", // For inProgress tasks
            "3" : "#completed" // For completed tasks
        };

    todo.init = function (options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(data, function (index, params) {
            generateElement(params);
        });

        /*generateElement({
            id: "123",
            code: "1",
            title: "asd",
            date: "22/12/2013",
            description: "Blah Blah"
        });*/

        /*removeElement({
            id: "123",
            code: "1",
            title: "asd",
            date: "22/12/2013",
            description: "Blah Blah"
        });*/

        /* Implementing Drag and Drop: we need to add the droppable() function
        to each of the categories as the elements are supposed to be dropped in any one of the three areas. */
        // Adding drop function to each category of task
        $.each(codes, function (index, value) {
            $(value).droppable({
                drop: function (event, ui) {
                        var element = ui.helper,
                            css_id = element.attr("id"),
                            id = css_id.replace(options.taskId, ""),
                            object = data[id];

                            // Removing old element
                            removeElement(object);

                            // Changing object code
                            object.code = index;

                            // Generating new element
                            generateElement(object);

                            // Updating Local Storage
                            data[id] = object;
                            localStorage.setItem("todoData", JSON.stringify(data));

                            // Hiding Delete Area
                            $("#" + defaults.deleteDiv).hide();
                    }
            });
        });

    // Implementing Drag and Drop: we need to add some code to delete tasks when they are dropped in the delete area.
    // Adding drop function to delete div
        $("#" + options.deleteDiv).droppable({
            drop: function(event, ui) {
                var element = ui.helper,
                    css_id = element.attr("id"),
                    id = css_id.replace(options.taskId, ""),
                    object = data[id];

                // Removing old element
                removeElement(object);

                // Updating local storage
                delete data[id];
                localStorage.setItem("todoData", JSON.stringify(data));

                // Hiding Delete Area
                $("#" + defaults.deleteDiv).hide();
            }
        })
    };

    //Current date.
    var d = new Date();
    var date = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
    var overDueClass= "";

      //Creating Tasks: Tasks are created using the following JavaScript function.
    // Add Task
    var generateElement = function(params){
        var parent = $(codes[params.code]),
            wrapper;

        if (!parent) {
            return;
        }

    //  Check the to-do date is less than current date then add class overDueClass with value 'overdue' to class 'to-do-task' if not add class overDueClass with value "".
        if(params.date < date) {
        overDueClass= "overdue";
      } else {
        overDueClass="";
      };

        wrapper = $("<div />", {
            "class" : defaults.todoTask+" "+overDueClass, //Add class overDueClass
            "id" : defaults.taskId + params.id,
            "data" : params.id
        }).appendTo(parent);

        $("<div />", {
            "class" : defaults.todoHeader,
            "text": params.title,
        }).appendTo(wrapper);

        $("<div />", {
            "class" : defaults.todoDate,
            "text": params.date,
        }).appendTo(wrapper),

        $("<div />", {
            "class" : defaults.todoDescription,
            "text": params.description
        }).appendTo(wrapper),
    // Add to-do owner to to-do task.
        $("<div />", {
            "class" : defaults.todoOwnner,
            "text": params.owner
        }).appendTo(wrapper)

    /* Implementing Drag and Drop: we need to make each task draggable and each of the three categories droppable.
    To delete a task, we need to hide the delete area by default, and show it during the time an item is being dragged.
    Therefore, we first modify the generateElement() function to first make the to-do list items draggable,
    and then make the delete area visible when the item is being drag. */
	    wrapper.draggable({
            start: function() {
                $("#" + defaults.deleteDiv).show();
            },
            stop: function() {
                $("#" + defaults.deleteDiv).hide();
            },
	        revert: "invalid",
	        revertDuration : 200
        });

    };

    // Deleting Tasks:
    var removeElement = function (params) {
        $("#" + defaults.taskId + params.id).remove();
    };
    /* Submitting the To-Do Form: when the to-do form is submitted, a new task is created and added to local storage, and the contents of the page are updated.
    The following function implements this functionality.*/
    todo.add = function() {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, description, date, tempData;

        if (inputs.length !== 5) {
            return;
        }

        title = inputs[0].value;
        description = inputs[1].value;
        date = inputs[2].value;
        owner = inputs[3].value

        if (!title) {
            generateDialog(errorMessage);
            return;
        }

        id = new Date().getTime();

        tempData = {
            id : id,
            code: "1",
            title: title,
            date: date,
            description: description,
            owner: owner
        };

        // Saving element in local storage
        data[id] = tempData;
        localStorage.setItem("todoData", JSON.stringify(data));

        // Generate Todo Element
        generateElement(tempData);

        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
        inputs[3].value = "";
    };

    var generateDialog = function (message) {
        var responseId = "response-dialog",
            title = "Messaage",
            responseDialog = $("#" + responseId),
            buttonOptions;

        if (!responseDialog.length) {
            responseDialog = $("<div />", {
                    title: title,
                    id: responseId
            }).appendTo($("body"));
        }

        responseDialog.html(message);

        buttonOptions = {
            "Ok" : function () {
                responseDialog.dialog("close");
            }
        };

	    responseDialog.dialog({
            autoOpen: true,
            width: 400,
            modal: true,
            closeOnEscape: true,
            buttons: buttonOptions
        });
    };

    // Clear data storage
    todo.clear = function () {
        data = {};
        localStorage.setItem("todoData", JSON.stringify(data));
        $("." + defaults.todoTask).remove();
    };

})(todo, data, jQuery);
