'use strict';
var Alexa = require("alexa-sdk"); //'amzn1.echo-sdk-ams.app.your-skill-id';
// var APP_ID = 'amzn1.ask.skill.bcfd6d9c-2ed4-4f8d-8238-04939ea1d036';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    // alexa.appId = 'amzn1.ask.skill.fa9070f2-bc03-4778-9d5d-deb9543c773b';
    alexa.dynamoDBTableName = 'DaysLeftTest';
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//==============================================================================
//===========================TEXT STRINGS=======================================
//==============================================================================

var speechOutput;
// var reprompt;
var welcomeOutput = "Hello, do want to know when you die?";
// var welcomeReprompt = "Say yes to continue or no to stop.";
var DaysLeftIntro = [
  "Cool. ",
  "Great. ",
  "Nice. "
];

// var newSessionHandlers = {
//     'NewSession': function() {
//         if(Object.keys(this.attributes).length === 0) {
//             this.attributes['endedSessionCount'] = 0;
//             this.attributes['gamesPlayed'] = 0;
//         }
//     },
//     "AMAZON.StopIntent": function() {
//       this.emit(':tell', "Goodbye!");
//     },
//     "AMAZON.CancelIntent": function() {
//       this.emit(':tell', "Goodbye!");
//     },
//     'SessionEndedRequest': function () {
//         console.log('session ended!');
//         //this.attributes['endedSessionCount'] += 1;
//         this.emit(":tell", "Goodbye!");
//     }
// };

var handlers = {
  'LaunchRequest': function() {
    if (!this.attributes['dateOfBirth']) {
      this.emit(':ask', welcomeOutput);
    } else {
      this.emit('NewSession');
    }
  },
  'DaysLeftIntent': function () {
    this.emit('NewSession');

    var filledSlots = delegateSlotCollection.call(this);
    console.log(JSON.stringify(filledSlots));
    var speechOutput = randomPhrase(DaysLeftIntro);

//==============================================================================
//===================================SLOTS======================================
//==============================================================================

    this.attributes['dateOfBirth']=filledSlots.slots.dateOfBirth.value;
    // this.attributes["dateOfBirth"];
    this.attributes['weight']=filledSlots.slots.weight.value;
    // this.attributes["weight"];
    this.attributes['exercise']=this.event.request.intent.slots.exercise.value;
    // this.attributes["exercise"];
    this.attributes['smoke']=this.event.request.intent.slots.smoke.value;
    // this.attributes["smoke"];
    this.attributes['drivingAccident']=this.event.request.intent.slots.drivingAccident.value;
    // this.attributes["drivingAccident"];
    this.attributes['drivingDUI']=this.event.request.intent.slots.drivingDUI.value;
    // this.attributes["drivingDUI"];

//==============================================================================
//===============================SPEECH OUTPUTS=================================
//==============================================================================
    speechOutput += "You were born on " + this.attribute['dateOfBirth'];
    speechOutput +=", you weigh " + this.attribute['weight'] + " pounds";
    speechOutput +=", you exercise for about " + this.attribute['exercise'] + " hours per week";

                      // car accident condition
    if (drivingAccident == "none" || "I've never been in an accident" || "I've never been in a car accidnt" || 0) {
      speechOutput += ", you haven't been in any car accidents in the past three years";
    } else {
      speechOutput += ", you've been in " + this.attribute['drivingAccident'] + " car accidents in the past three years";
    };
                      // DUI condition
    if (drivingDUI == "none" || "I never drive under the influence" || 0) {
      speechOutput += ", you haven't had any DUI's";
    } else {
      speechOutput += ", you've had " + this.attribute['drivingDUI'] + " DUI's";
    };
                      //smoking condition
    if (smoke == 'none' || "I don't smoke" || 0) {
      speechOutput += ", and you don't smoke";
    } else {
      speechOutput += ", and you smoke " + this.attribute['smoke'] + " packs a day";
    };

    speechOutput += ". You're still a loser though. And judging by your voice you sound like you don't have any friends at all."

//==============================================================================

//==============================================================================


    this.emit(":tell", speechOutput);
  },
  'AMAZON.HelpIntent': function () {
    speechOutput = '';
    reprompt = '';
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
        speechOutput = "";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        speechOutput = "";
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        var speechOutput = "";
        this.emit(':tell', speechOutput);
    },
};
//
// exports.handler = (event, context) => {
//     var alexa = Alexa.handler(event, context);
//     alexa.APP_ID = APP_ID;
//     // To enable string internationalization (i18n) features, set a resources object.
//     //alexa.resources = languageStrings;
//     alexa.registerHandlers(handlers);
//     alexa.execute();
// };

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}

function randomPhrase(array) {
  var i = 0;
  i = Math.floor(Math.random() * array.length);
  return(array[i]);

}
// function isSlotValid(request, slotName){
//   var slot = request.intent.slot[slotName];
//   var slotValue;
//
//   if (slot && slot.value) {
//     slotValue = slot.value.toLowerCase();
//     return slotValue;
//   } else {
//     return false;
//   }
// }

// var newSessionHandlers = {
//     'NewSession': function() {
//         if(Object.keys(this.attributes).length === 0) {
//             this.attributes['endedSessionCount'] = 0;
//             this.attributes['gamesPlayed'] = 0;
//         }
//         this.handler.state = states.STARTMODE;
//         this.emit(':ask', 'Welcome to your Days Left to Live calculator. You have played '
//             + this.attributes['gamesPlayed'].toString() + ' times. would you like to play?',
//             'Say yes to start the game or no to quit.');
//     },
//     "AMAZON.StopIntent": function() {
//       this.emit(':tell', "Goodbye!");
//     },
//     "AMAZON.CancelIntent": function() {
//       this.emit(':tell', "Goodbye!");
//     },
//     'SessionEndedRequest': function () {
//         console.log('session ended!');
//         //this.attributes['endedSessionCount'] += 1;
//         this.emit(":tell", "Goodbye!");
//     }
// };
//
// var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
//     'NewSession': function () {
//         this.emit('NewSession'); // Uses the handler in newSessionHandlers
//     },
//     'SessionEndedRequest': function () {
//         console.log("SESSIONENDEDREQUEST");
//         //this.attributes['endedSessionCount'] += 1;
//         this.emit(':tell', "Goodbye!");
//     }
// });
