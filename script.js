//Global Constants
const clueHoldTime = 500;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;

//Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;

//function for start game button
function startGame()
{
  //initializing game variables
  progress = 0;
  gamePlaying = true;
  
  //swapping start and stop buttons appropriately
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  //playing the pattern
  playClueSequence();
}

//function for stop game button
function stopGame()
{
  //changing game variables
  gamePlaying = false;
  
  //swapping start and stop buttons appropriately
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
}

//functions to light buttons for pattern
function lightButton(btn)
{
  document.getElementById("button"+btn).classList.add("lit");
}
function clearButton(btn)
{
  document.getElementById("button"+btn).classList.remove("lit");
}

//function to play a single clue in pattern
function playSingleClue(btn)
{
  if(gamePlaying)
    {
      lightButton(btn);
      playTone(btn, clueHoldTime);
      setTimeout(clearButton, clueHoldTime, btn);
    }
}

//function to play a sequence of clues in pattern
function playClueSequence()
{
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0; i<=progress; i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function guess(btn)
{
  console.log("user guessed: " + btn);
  if(!gamePlaying)
  {
    return;    
  }
  
  if(btn == pattern[guessCounter])
  {
    if(guessCounter == progress)
    {
      if(progress == pattern.length-1)
      {
        winGame();
      }
      else
      {
        progress++;
        playClueSequence();
      }
    }
    else
    {
      guessCounter++;
    }
  }
  else
  {
    loseGame();
  }
}

//function if player loses by choosing incorrect answer
function loseGame()
{
  stopGame();
  alert("Game Over. You lost.");
}

//function for if player wins entire game
function winGame()
{
  stopGame();
  alert("Game Over. You won!");
}

// Sound Synthesis Function
const freqMap = 
{
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

// Sound Synthesis Function
function playTone(btn,len)
{ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

// Sound Synthesis Function
function startTone(btn)
{
  if(!tonePlaying)
  {
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

// Sound Synthesis Function
function stopTone()
{
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)