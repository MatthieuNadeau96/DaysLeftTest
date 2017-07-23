'use strict';
var Alexa = require("alexa-sdk"); //'amzn1.echo-sdk-ams.app.your-skill-id';
// var APP_ID = 'amzn1.ask.skill.bcfd6d9c-2ed4-4f8d-8238-04939ea1d036';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = 'amzn1.ask.skill.fa9070f2-bc03-4778-9d5d-deb9543c773b';
    alexa.dynamoDBTableName = 'DaysLeft';
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var speechOutput;
var reprompt = "Hi.";
var welcomeOutput = "Hello, welcome to your very own, death calculator!" ;
// var welcomeReprompt = "Say yes to continue or no to stop.";
var DaysLeftIntro = [
  "Cool. ",
  "Great. ",
  "Nice. ",
  "That's nice. ",
  "Excellent. ",
  "Thank you!. ",
  "Splendid! ",
  "Wow...Really? Well, okay then. "
];


var handlers = {
  'LaunchRequest': function() {
        if(Object.keys(this.attributes).length === 0) {
            this.attributes['endedSessionCount'] = 0;
            this.attributes['gamesPlayed'] = 0;
          }
          this.emit(':ask', welcomeOutput + " You've played "
          + this.attributes['gamesPlayed'].toString()
          + " times. Do want to know when you will die?");
        },
  'DaysLeftIntent': function () {
      this.emit(':ask', 'Okay...' + "I'm going to ask you a few questions to understand more about you.");
      var filledSlots = delegateSlotCollection.call(this);
      console.log(JSON.stringify(filledSlots));
      var speechOutput = randomPhrase(DaysLeftIntro);

      var dateOfBirth=filledSlots.slots.dateOfBirth.value
      console.log(this.attributes['gamesPlayed']);
      this.attributes['dateOfBirth'] = dateOfBirth;
      // this.attributes["dateOfBirth"];
      var weight=filledSlots.slots.weight.value;
      this.attributes['weight'] = weight;
      // this.attributes["weight"];
      var exercise=filledSlots.slots.exercise.value;
      this.attributes['exercise'] = exercise;
      // this.attributes["exercise"];
      var smoke=filledSlots.slots.smoke.value;
      this.attributes['smoke'] = smoke;
      // this.attributes["smoke"];
      var drivingAccident=filledSlots.slots.drivingAccident.value;
      this.attributes['drivingAccident'] = drivingAccident;
      // this.attributes["drivingAccident"];
      var drivingDUI=filledSlots.slots.drivingDUI.value;
      this.attributes['drivingDUI'] = drivingDUI;
      // this.attributes["drivingDUI"];


      speechOutput += "You were born on " + dateOfBirth;
      speechOutput +=", you weigh " + weight + " pounds";
      speechOutput +=", you exercise for about " + exercise + " hours per week";

                        // car accident condition
      if (drivingAccident == "none" || "I've never been in an accident" || "I've never been in a car accidnt" || 0) {
        speechOutput += ", you haven't been in any car accidents in the past three years";
      } else {
        speechOutput += ", you've been in " + drivingAccident + " car accidents in the past three years";
      };
                        // DUI condition
      if (drivingDUI == "none" || "I never drive under the influence" || 0) {
        speechOutput += ", you haven't had any DUI's";
      } else {
        speechOutput += ", you've had " + drivingDUI + " DUI's";
      };
                        //smoking condition
      if (smoke == 'none' || "I don't smoke" || 0) {
        speechOutput += ", and you don't smoke";
      } else {
        speechOutput += ", and you smoke " + smoke + " packs a day";
      };
      speechOutput += ". You're still a loser though. And judging by your voice you sound like you don't have any friends at all."
      this.emit(":tell", speechOutput);
  },
  "AMAZON.HelpIntent": function() {
      this.emit(':tell', reprompt);
    },
  "AMAZON.StopIntent": function() {
      this.emit(':tell', "Goodbye!");
    },
  "AMAZON.CancelIntent": function() {
      this.emit(':tell', "Goodbye!");
    },
  'SessionEndedRequest': function () {
      console.log('session ended!');
      //this.attributes['endedSessionCount'] += 1;
      this.emit(":tell", "Goodbye!");
    }
};
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
function isSlotValid(request, slotName){
  var slot = request.intent.slot[slotName];
  var slotValue;

  if (slot && slot.value) {
    slotValue = slot.value.toLowerCase();
    return slotValue;
  } else {
    return false;
  }
}
function unhandled() {
  console.log("suck my nut");
}
