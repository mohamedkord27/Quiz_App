
// select elements
let countSpan = document.querySelector(".count span");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let countdownElement = document.querySelector(".countdown");
let resultsContainer = document.querySelector(".results");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// get questions 

getQuestions();

function getQuestions(){
  let myRequest= new XMLHttpRequest();

  myRequest.onreadystatechange= function(){
    if(this.readyState=== 4 && this.status=== 200){
      let questionsObject= JSON.parse(this.responseText);
      console.log(questionsObject);
      let qCount= questionsObject.length;

       // create bullets

        createBullets(qCount);

        // add questions 
        addQuestionData(questionsObject[currentIndex], qCount)
        // Start CountDown
        countdown(3, qCount);
        

      submitButton.onclick= function(){

        let theRightAnswer= questionsObject[currentIndex].right_answer;

        currentIndex++;

        //check the answer
        checkAnswer(theRightAnswer, qCount);

        quizArea.innerHTML="";
        answersArea.innerHTML="";
        // add questions 
        addQuestionData(questionsObject[currentIndex], qCount)

        // handle bullets
        handleBullets();
        
        // Show Results
        showResults(qCount);
          // Start CountDown
        clearInterval(countdownInterval);
        countdown(3, qCount);

      }

    }
  }

  myRequest.open("get", "html_questions.json");
  myRequest.send();
}

// create bullets

function createBullets(num){
  countSpan.innerHTML= num;

  // create spans

  for(let i=0; i<num; i++){
    let theBullet= document.createElement("span");
    bulletsSpanContainer.appendChild(theBullet);
    if(i===0){
      theBullet.className="on";
    }
  }
}

// add questions data

function addQuestionData(obj, count){
  if(currentIndex<count){
    let questionTitle= document.createElement("h2");

    quizArea.appendChild(questionTitle);

    let questionText= document.createTextNode(obj["title"]);

    questionTitle.appendChild(questionText);


    // create answers

    for(let i=1; i<=4; i++){
      let mainDiv= document.createElement("div");
      answersArea.appendChild(mainDiv);
      mainDiv.className="answer";

      let radioInput= document.createElement("input");
      radioInput.type= "radio";
      radioInput.name= "question";
      radioInput.id= `answer_${i}`;
      radioInput.dataset.answer= obj[`answer_${i}`];
      mainDiv.appendChild(radioInput);

      if(i===0){
        radioInput.checked= true;
      }

      theLabel= document.createElement("label");
      theLabel.htmlFor= `answer_${i}`;
      mainDiv.appendChild(theLabel);

      let theLabelText= document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
    }
  }
}

// check answers

function checkAnswer(rAnswer,count){
  let answers= document.getElementsByName("question");

  let theChoosenAnswer;

  for(let i=0; i< answers.length; i++){

    if(answers[i].checked){
      theChoosenAnswer= answers[i].dataset.answer;
    }
  }
    if(rAnswer=== theChoosenAnswer){
      rightAnswers++;
    }
    
}

// handle bullets

function handleBullets(){
  let bulletsSpans= document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans= Array.from(bulletsSpans);

  arrayOfSpans.forEach((span, index)=>{
    if(currentIndex=== index){
      span.className="on";
    }
  });
}

// show results

function showResults(count){
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}
//count down
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}