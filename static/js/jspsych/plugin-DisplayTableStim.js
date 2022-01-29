var jsPsychDisplayTableStim = (function (jspsych) {
  'use strict';

  const info = {
      name: "DisplayTableStim",
      parameters: {
        //   num_rows: {
        //       type: jspsych.ParameterType.INT,
        //       pretty_name: "Number Rows",
        //       default: null,
        //   },
          /** Array containing the contents to be presented in the table. */
          table_contents: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Table Contents",
              array: true,
              default: undefined,
          },
          /** Array containing the header column labels. Uses length for number of columns to make.*/
          header_labels: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Labels",
              array: true,
              default: undefined,
          },

          /** String to display at top of the page, above the table.*/
          preamble: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Preamble",
              default: "",
          },
          /** Label of the button to submit response. */
          button_label: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Button Label",
              default: "Continue",
          },
          /** The correct response. */
          answer: {
            type: jspsych.ParameterType.HTML_STRING,
            pretty_name: "Answer for Trial",
            default: undefined,
        },

      },
  };
  /**
   *
   * jsPsych plugin
   *
   * @author Isaac Menchaca
   * 
   */
  class DisplayTableStimPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          var html = "";
          // inject CSS for trial
          html += '<style id="jspsych-DisplayTableStim-css">';
          html +=
              ".jspsych-DisplayTableStim-statement {display:block; font-size: 16px; padding-top: 40px; margin-bottom:10px;}" +
                  "table.jspsych-DisplayTableStim-table {border-collapse: collapse; padding: 15px; margin-left: auto; margin-right: auto;}" +
                  "table.jspsych-DisplayTableStim-table td, th {border-bottom: 1px solid #dddddd; text-align: left; padding: 8px;}" +
                  "table.jspsych-DisplayTableStim-table tr:nth-child(even) {background-color: #dddddd;}";
          html += "</style>";
          // show preamble text
          if (trial.preamble !== null) {
              html +=
                  '<div id="jspsych-DisplayTableStim-preamble" class="jspsych-DisplayTableStim-preamble">' +
                      trial.preamble +
                      "</div>";
          }
          html += '<form id="jspsych-DisplayTableStim-form">'; // Everything good here. -------------------

          // Start with column headings  -- this is denoted by th (ISAAC VERSION)
          var DisplayTableStim_table = '<table class="jspsych-DisplayTableStim-table"><tr>' // need to finish this </tr>
          

          for (var i = 0; i < trial.header_labels.length; i++) {
            DisplayTableStim_table += '<th id="jspsych-DisplayTableStim-column' + i.toString + '-headerlabel">' +
                                        trial.header_labels[i] + '</th>'
          }
          DisplayTableStim_table += '</tr>'; // need to finish this </tr>


          for (var i = 0; i < trial.table_contents.length; i++) {
              DisplayTableStim_table += '<tr>'
              for (var j = 0; j < trial.table_contents[i].length; ++j){
                console.log(trial.table_contents[i][j]);
                DisplayTableStim_table += '<td id="jspsych-DisplayTableStim-col-' + i.toString() + '-row-' + j.toString() + '">' +
                                            trial.table_contents[i][j] + '</td>';
              }
              DisplayTableStim_table += '</tr>'
          }

          html += DisplayTableStim_table
          html += "</table>";
          html += '<br><br><div><50k<input class="jspsych-DisplayTableStim-radioBox" type="radio" name="userResponse" id="lessThan" value="lessThan50"> </input>' +
                  '<input type="submit" id="jspsych-DisplayTableStim-submission" class="jspsych-DisplayTableStim jspsych-btn" disabled value="' +
                  trial.button_label +
                  '"></input><input class="jspsych-DisplayTableStim-radioBox" type="radio" name="userResponse" id="greaterThan" value="greaterThan50"></input>50k<</div></form>';

          
          display_element.innerHTML = html;

          // will not allow user to submit until response is given.
          var userResponse = document.getElementsByName("userResponse");
          userResponse.forEach((radialInput)=>{
            radialInput.addEventListener("click", ()=>{
                //var checkResponse = Array.from(document.getElementsByName("userResponse")).some((c) => c.checked);
                var left_checked = document.getElementById("lessThan").checked;
                var right_checked = document.getElementById("greaterThan").checked;
                if (left_checked || right_checked) {
                    document.getElementById("jspsych-DisplayTableStim-submission").disabled =false;
                    valueOfAnswer = radialInput.value
                }
                else{
                    document.getElementById("jspsych-DisplayTableStim-submission").disabled =true;
                }
                console.log(valueOfAnswer);
              });
          });


          // Get the data once the submit button is clicked
          // Get the data once the submit button is clicked


          // console.log(document.getElementById("jspsych-DisplayTableStim-submission"));
          //  console.log(display_element.querySelector("#jspsych-DisplayTableStim-submission")); // the same as above
         
          // need to query the form and not by the ID of the button. also need (e)=> format for this.jsPsych to work.
          display_element.querySelector("#jspsych-DisplayTableStim-form").addEventListener('submit', (e)=>{
              e.preventDefault();
              // measure response time
              var endTime = performance.now();
              var response_time = Math.round(endTime - startTime);
             
              var correct = false;
              if (trial.answer == valueOfAnswer){
                correct = true;
              };
              // data saving
              let data = {
                  rt: response_time,
                  answer: trial.answer,
                  response: valueOfAnswer,
                  correct: correct,
              };
              
              // clear the display
              display_element.innerHTML = "";
              
              // next trial
              console.log(data);

              this.jsPsych.finishTrial(data);
          });

          var startTime = performance.now();
          var valueOfAnswer = null;
          console.log(startTime);
      }
  
  }
  DisplayTableStimPlugin.info = info;

  return DisplayTableStimPlugin;

})(jsPsychModule);
