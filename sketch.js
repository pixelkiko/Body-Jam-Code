// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;
let isFirstTime = true;
let song;
let songPlaying = false;

function setup() {
  var canvs = createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  var context = new AudioContext();
 
  document.querySelector('button').addEventListener('click', function() {
  context.resume().then(() => {
    //  song = new Pizzicato.Sound('biisi.mp3', function() {
      song = new Pizzicato.Sound('https://www.mboxdrive.com/song.mp3', function() {
      // song.volume = 0.5;
      // Sound loaded!
      console.log('Playback resumed successfully');
      song.play();
      songPlaying = true;
      console.log('PLAYING')
      
      
  });
});
});
poseNet.on('pose', gotPoses);
}

var reverb_ins_flag = 1;
var delay_ins_flag = 1;
var volume_ins_flag = 1;

// JK's new variables //
var reverb_flag = 0;
var pause_flag = 1;
var gun_flag = 1;
var rewind_flag = 1;
var drum_flag = 1;

var highpass_flag = 1;
var highpass_ins_flag = 1;
// end //

// ANQI's new variables //
// controlling all effect
// 0 - Nothing, 1 - Delay, 2 - Volume, 3 - Reverb, 4 - Pass
// 5 - Gun, 6 - Stop, 7 - Flanger, 8 - Rewind, 9 - Comp
var flag_effect = 0; 

// // controlling all buttons
// var flag_button = 0;
// // end //

// sound effect for REVERB
var reverb = new Pizzicato.Effects.Reverb({
  time: 1,
  decay: 0.01,
  reverse: true,
  mix: 0.5
});

// sound effect for Compressor
var comp = new Pizzicato.Effects.Compressor({
  threshold: -20,
  knee: 22,
  attack: 0.05,
  release: 0.05,
  ratio: 18
});

var highPassFilter = new Pizzicato.Effects.HighPassFilter({
  frequency: 10,
  peak: 10
});

let delay = new Pizzicato.Effects.Delay({
  feedback: 0.3,
  time: 1.0,
  mix: 0.5
});

//sound effect for Flanger
var flanger = new Pizzicato.Effects.Flanger(); ({
  time: 0.45,
  speed: 0.2,
  depth: 0.1,
  feedback: 0.1,
  mix: 0.5
})


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;

    let lW_x = Math.round(pose.leftWrist.x);
    let lW_y = Math.round(pose.leftWrist.y);

    let rW_x = Math.round(pose.rightWrist.x);
    let rW_y = Math.round(pose.rightWrist.y);

    skeleton = poses[0].skeleton;
    if (skeleton.length > 0) {
      skeleton[0].forEach(element => {

        // check if your selected part has been detected by the webcam
        if(element.part === 'leftShoulder') {
          leftShoulder = element
        }
      });
    }

    // BUTTON STATUS CONTROL
    if(flag_effect == 0){

      // APPLYING REVERB
      if(lW_x>527 && lW_x<625) {
        if(lW_y>288 && lW_y<466){
          flag_effect = 3;
          reverb_flag = 1;
          document.getElementById("reverb").src = "imgs/Reverb_click.png"
  
          console.log('Applying reverb effect');
          // song.addEffect(reverb);
  
          // TRIGGER THE BUTTON FOR THE FIRST TIME
          if(reverb_ins_flag == 1){
            document.getElementById("ins_main").src = "imgs/Reverb_ins.png"
            setTimeout(() => {
              document.getElementById("ins_main").src = ""
              document.getElementById("ins_min").src = "imgs/Reverb_min.png"
            }, 4000)
  
            setTimeout(() => {
              document.getElementById("ins_min").src = ""
              document.getElementById("reverb").src = "imgs/Reverb.png"
              console.log('removing effect')
              reverb_ins_flag = 0;
              song.removeEffect(reverb)

              delay_ins_flag = 0;
              flag_effect = 0;
              reverb_flag = 1;
              console.log("REVERB STOP-----------------------------------------");
            }, 9000)      
          } 
  
          else {
            document.getElementById("ins_min").src = "imgs/reverb_min.png"
            setTimeout(() => {
              document.getElementById("ins_min").src = ""
              document.getElementById("reverb").src = "imgs/Reverb.png"
              console.log('removing effect')
              song.removeEffect(reverb)

              flag_effect = 0;
              reverb_flag = 1;
              console.log("REVERB STOP-----------------------------------------");
            }, 6000)
          }
        } 
      }

      // APPLYING HIGH PASS EFFECT
      if(lW_x>496 && lW_x<625) {
        if(lW_y>93 && lW_y<271){
          flag_effect = 4;
            document.getElementById("pass").src = "imgs/Pass Filter_click.png"
            if(highpass_flag==1){ //flag makes sure effect only be added for once
              console.log('Applying high pass');
              song.addEffect(highPassFilter);
              highpass_flag = 0;
            }
            // TRIGGER THE BUTTON FOR THE FIRST TIME
            if(highpass_ins_flag == 1){
              document.getElementById("ins_main").src = "imgs/pass filter_ins.png"
              setTimeout(() => {
               document.getElementById("ins_main").src = ""
               document.getElementById("ins_min").src = "imgs/pass filter_min.png"
              }, 6000)

              setTimeout(() => {
                document.getElementById("ins_min").src = ""
                document.getElementById("pass").src = "imgs/Pass Filter.png"
                console.log('removing high pass filter')
                song.removeEffect(highPassFilter)
                
                highpass_ins_flag = 0;
                flag_effect = 0;
                highpass_flag = 1; 
              }, 6000)      
            } 

            else {
                document.getElementById("ins_min").src = "imgs/pass filter_min.png"
                setTimeout(() => {
                document.getElementById("ins_min").src = ""
                document.getElementById("pass").src = "imgs/Pass Filter.png"
                console.log('removing high pass effect')
                song.removeEffect(highPassFilter)
                highpass_flag = 1; 
                flag_effect = 0;
              }, 4000)
            }

        } 
      }

      // //  APPLYING DELAY EFFECT
      if(rW_x>0 && rW_x<90) {
        // if(rW_y>291 && rW_y<469){
        if(rW_y>221 && rW_y<400){
          // AQ
          flag_effect = 1;
          document.getElementById("delay").src = "imgs/Delay_click.png"

          console.log('Applying delay');
          song.addEffect(delay);

          // TRIGGER THE BUTTON FOR THE FIRST TIME
          if(delay_ins_flag == 1){
            document.getElementById("ins_main").src = "imgs/Delay_ins.png"
            setTimeout(() => {
              document.getElementById("ins_main").src = ""
              document.getElementById("ins_min").src = "imgs/Delay_min.png"
            }, 4000)

            setTimeout(() => {
              document.getElementById("ins_min").src = ""
              document.getElementById("delay").src = "imgs/Delay.png"

              console.log('removing effect')
              song.removeEffect(delay)             
              delay_ins_flag = 0;
              flag_effect = 0;

              console.log("DELAY STOP-----------------------------------------");
            }, 9000)      
          } 

          else {
            document.getElementById("ins_min").src = "imgs/Delay_min.png"
            setTimeout(() => {
              document.getElementById("ins_min").src = ""
              document.getElementById("delay").src = "imgs/Delay.png"

              console.log('removing effect')
              song.removeEffect(delay)
              flag_effect = 0;
              console.log("VOLUME STOP-----------------------------------------");
            }, 6000)
          }
          
        } 
      }

      //  APPLYING VOLUME CHANGING
      if(rW_x>0 && rW_x<97) {
        // if(rW_y>80 && rW_y<250){
        if(rW_y>80 && rW_y<210){
          flag_effect = 2;
          document.getElementById("volume").src = "imgs/Volume_click.png"

          // TRIGGER THE BUTTON FOR THE FIRST TIME
          if(volume_ins_flag == 1){
            document.getElementById("ins_main").src = "imgs/Volume_ins.png"
            setTimeout(() => {
              document.getElementById("ins_main").src = ""
              document.getElementById("ins_min").src = "imgs/Volume_min.png"
            }, 4000)

            setTimeout(() => {
              document.getElementById("ins_min").src = ""
              document.getElementById("volume").src = "imgs/Volume.png"
           
              volume_ins_flag = 0;
              flag_effect = 0;
              song.volume = 0.5;
              console.log("VOLUME STOP-----------------------------------------");

            }, 9000)      
          } 

          else {
            document.getElementById("ins_min").src = "imgs/Volume_min.png"
            setTimeout(() => {
              document.getElementById("ins_min").src = ""
              document.getElementById("volume").src = "imgs/Volume.png"

              flag_effect = 0;
              song.volume = 0.5;
              console.log("VOLUME STOP-----------------------------------------");
            }, 6000)
          }

        }
      }



          // PAUSING AND PLAYING
    if(lW_x>416 && lW_x<552) {
      if(lW_y>408 && lW_y<470){
        flag_effect = -1;
        if(pause_flag == 1){
          console.log("yyyyyyyyy", lW_y);
          if (songPlaying === false && song) {
            pause_flag = 0;
            document.getElementById("pause").style.opacity = "65%"
            song.play();
            songPlaying = true;
            console.log('SONG PLAY++++++++++++++++++++++++++++++++++++++++++')
            setTimeout(() => {
              pause_flag = 1;
            }, 1000)
            setTimeout(() => {
              flag_effect = 0;
            }, 3000)
          } 
          else if (songPlaying === true && song) {
            pause_flag = 0;
            song.pause();
            document.getElementById("pause").style.opacity = "100%"

            songPlaying = false;
            console.log('SONG PAUSE------------------------------------------------')

            setTimeout(() => {
              pause_flag = 1;
            }, 1000)
            setTimeout(() => {
              flag_effect = 0;
            }, 3000)

          }
        }
      } 
    }

    // GUNSHOT
    if(rW_x>64 && rW_x<200) {
      if(rW_y>408 && rW_y<471){
        flag_effect = -1;
        if(gun_flag == 1){
          gun_flag = 0;
          document.getElementById("gun").style.opacity = "100%"
          console.log('gunshot is in the right position')
          // gunshot sound effect
          gunshot = new Pizzicato.Sound('https://www.mboxdrive.com/gunshot.mp3', function() {
            // gunshot = new Pizzicato.Sound('https://www.mboxdrive.com/rewind.mp3', function() {
              
            console.log('Gunshot loaded')
            gunshot.volume = 0.5;
            gunshot.play();
          });
          setTimeout(() => {
              document.getElementById("gun").style.opacity = "65%"
          }, 300)
          setTimeout(() => {
              gun_flag = 1;
          }, 800)

          setTimeout(() => {
            flag_effect = 0;
          }, 3000)
        }
      } 
    }

    // REWIND
    // console.log("yyyyyyyyyyyyyyy",rW_y);
    if(rW_x>153 && rW_x<290) {
      if(rW_y>18 && rW_y<81){  
        flag_effect = -1;
        if(rewind_flag == 1){      
          rewind_flag = 0;
          document.getElementById("rewind").style.opacity = "100%"
          console.log('Rewind is in the right position')

          rewind = new Pizzicato.Sound('https://www.mboxdrive.com/rewind.mp3', function() {
            console.log('REWIND loaded')
            rewind.play();
          });
          song.stop();

          setTimeout(() => {
              document.getElementById("rewind").style.opacity = "65%"
          }, 300)
          setTimeout(() => {
            rewind_flag = 1;
            song.play();
          }, 2000)

          setTimeout(() => {
            flag_effect = 0;
          }, 3000)

        }
      } 
    }

    // DRUM
    if(lW_x>325 && lW_x<462) {
      if(lW_y>18 && lW_y<81){ 
        flag_effect = -1; 
        if(drum_flag == 1){      
          drum_flag = 0;
          document.getElementById("comp").style.opacity = "100%"
          console.log('Rewind is in the right position')

          drum = new Pizzicato.Sound('https://www.mboxdrive.com/drum.mp3', function() {
            console.log('REWIND loaded')
            drum.play();
          });

          setTimeout(() => {
              document.getElementById("comp").style.opacity = "65%"
              drum_flag = 1;
          }, 300)

          setTimeout(() => {
            flag_effect = 0;
          }, 3000)

        }
      } 
    }


    }

    //CONTINUOSLY CHANGING EFFECT
    // 1 - DELAY
    if(flag_effect == 1){
      let nosePos = Math.round(pose.nose.x);
      delay.time = ((nosePos-320)/580 + 0.5)*2;
      delay.mix = (nosePos-320)/580 + 0.5;
      console.log("delay_mix", delay.mix);
    }
    // 2 - VOLUME
    if(flag_effect == 2){
      let freq = Math.round(pose.rightWrist.y);
      volume = 0.5 - (freq-240)/320;
      console.log('VOLUME ', volume)
      if(song) {
        song.volume = volume;
      }
    }

    // 3 - REVERB
    if(flag_effect == 3){
      let rightWristPos = Math.round(pose.rightWrist.x);
      let leftElbowPos = Math.round(pose.leftElbow.x);

      let diff = Math.abs(leftElbowPos - rightWristPos)

      if (diff < 100){
        console.log('diff', diff)
        // MAKE SURE THAT THIS EFFECT WILL ONLY BE ADDED ONCE
        // TO AVOID THE HARSH NOICE
        if(reverb_flag == 1){
          console.log("REVERB ADDED ++++++++++++++++++++++++++++++++++++++++++++++");
          song.addEffect(reverb);
          reverb_flag = 0;
       }

        // console.log('THE GESTURE IS WORKINGGGG') 
        // reverb.decay = Math.round((rightWristPos +0.01)/100)
        // console.log('The reverb decay is ', reverb.decay) 
      }
    }

    // 4 - HIGH PASS FILTER
    if(flag_effect == 4){
      let rightWristPos = Math.round(pose.rightWrist.x);
      let leftWristPos = Math.round(pose.leftWrist.x);
      let diff = Math.abs(leftWristPos - rightWristPos);
      console.log ('right wrist is', rightWristPos);
      console.log ('left wrist is', leftWristPos);
      console.log('diff is', diff);
      if (diff <100){
        highPassFilter.frequency = leftWristPos ;
        console.log('HIGH  PASS FILTERR  WORKS');
        console.log('high pass frequency is', highPassFilter.frequency);
      }
    }



  }
}


function modelLoaded() {
  console.log('poseNet ready');
}



function draw() {

 /* translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);*/
    image(video, 0, 0);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
}

