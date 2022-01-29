/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// All pages to be loaded
var pages = [
    "instructions/instruct-1.html",
    "instructions/instruct-2.html",
    "instructions/instruct-practiceStart.html",
];

const init = (async () => {
    await psiTurk.preloadPages(pages);
})()


var instructionPages = [ // add as a list as many pages as you like
    "instructions/instruct-1.html",
    "instructions/instruct-2.html",
    "instructions/instruct-practiceStart.html",
];

var experimentTask = function(){
     /* Initialize jsPsych */
var jsPsych = initJsPsych({
        on_data_update: function(data) {
            psiTurk.recordTrialData(data);
         },
        on_finish: function() {
            psiTurk.saveData({
                success: function() {
                    psiTurk.completeHIT();
                }
            });
        }
    });

        /* create timeline */
var timeline = [];
  

/* define welcome message trial */
var practiceGetReady = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<p style="font-size: 30px;">This is the practice trial. Press any key to begin.</p>',
  };
  
// declare the the experiment instructions.
var experimentInstructionsPage = {
    type: jsPsychExternalHtml,
    url: "instructions/instruct-experimentStart.html",
    cont_btn: "next"
};

/* define welcome message trial */
var experimentGetReady = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p style="font-size: 30px;">This is the real experiment. Press any key to begin.</p>',
    on_finish: function(){
      psiTurk.finishInstructions();
  }
};

    /* define welcome message trial */
var display_table_stim_page = {
        type: jsPsychDisplayTableStim,
        table_contents: [['Age', '50', '4'],
                            ['Sex', 'Male', '3'],
                            ['Race', 'White', '3'],
                            ['Marital Status', 'Married, spouse civilian', '4'],
                            ['Years of Education', '10', '2'],
                            ['Occupation', 'Executive and managerial', '5'],
                            ['Hours per week', '40', '2']
                        ],
        header_labels: ['Attributes', 'Value', 'Chance'],
        preamble: '<p> Please select if this individual makes more or less than <b>$50,000</b> per year. </p>',
        button_label: 'Continue',
        answer: "lessThan50" // be careful, this is verbatim.
    };
  
var display_table_stim_page2 = {
        type: jsPsychDisplayTableStim,
        table_contents: [['Age', '50'],
                            ['Sex', 'Male'],
                            ['Race', 'White'],
                            ['Marital Status', 'Married, spouse civilian'],
                            ['Years of Education', '10'],
                            ['Occupation', 'Executive and managerial'],
                            ['Hours per week', '40']
                        ],
        header_labels: ['Attributes', 'Value'],
        preamble: '<p> Please select if this individual makes more or less than <b>$50,000</b> per year. </p>',
        button_label: 'Continue',
        answer: "greaterThan50" // be careful, this is verbatim.
    };
  

timeline.push(practiceGetReady);
timeline.push(display_table_stim_page);
timeline.push(experimentInstructionsPage);
timeline.push(experimentGetReady);
timeline.push(display_table_stim_page2);
timeline.push(display_table_stim_page2);
timeline.push(display_table_stim_page2);
timeline.push(display_table_stim_page2);
  
    /* start the experiment */
jsPsych.run(timeline);


};

// Task object to keep track of the current phase
var currentview;
 // The reason that `await psiTurk.preloadPages()` is not put directly into the
 // function bound to `window.on('load')` is that this would mean that the pages
 // would not begin to preload until the window had finished loading -- an unnecessary delay.
 $(window).on('load', async () => {
    await init;
    psiTurk.doInstructions(
        instructionPages, // a list of pages you want to display in sequence
        function() { currentview = new experimentTask(); } // what you want to do when you are done with instructions
    );
});

