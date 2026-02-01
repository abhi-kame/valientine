// Get the name from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get('name') || "Beautiful";

// Initialize the page with the dynamic name
document.addEventListener("DOMContentLoaded", () => {
    const nameElement = document.getElementById("name");
    const questionElement = document.getElementById("question");
    
    if (userName.toLowerCase() === "beautiful") {
        nameElement.textContent = `Hey ${userName}!`;
        questionElement.textContent = `Will you be my Valentine?`;
    } else {
        nameElement.textContent = `Hey ${userName}!`;
        questionElement.textContent = `${userName}, Will you be my Valentine?`;
    }
});

let videoPlayed = false;
let noButtonHoverCount = 0;

function showMessage(response) {
  if (response === "No") {
    const noButton = document.getElementById("no-button");
    const container = document.querySelector(".Mainprompt");
    
    // Set the button position to fixed to move it anywhere on the screen
    noButton.style.position = "fixed";

    // Replace the image with the video
    const mainImg = document.getElementsByClassName("image")[0];
    if (mainImg && !videoPlayed) {
        const videoElement = document.createElement("video");
        videoElement.src = "./Maroon 5 - Sugar.mp4#t=42";
        videoElement.autoplay = true;
        videoElement.controls = false;
        videoElement.loop = true;
        
        // Match the image's styles for a seamless replacement
        videoElement.className = "image"; // Inherits size and border-radius
        videoElement.style.objectFit = "cover";
        videoElement.style.height = mainImg.offsetHeight + "px";
        
        mainImg.parentNode.replaceChild(videoElement, mainImg);
        videoPlayed = true;
    }

    moveButton(noButton);

    // Update text content and hide the name message
    document.getElementById("question").textContent = "Choose wisely! ❤️";
    document.getElementById("name").style.opacity = "0";

    // Add a mouseover event listener to the "No" button if not already added
    if (noButtonHoverCount === 0) {
        noButton.addEventListener("mouseover", () => {
          moveButton(noButton);
        });
    }
    noButtonHoverCount++;
  }

  if (response === "Yes") {
    // Remove the name message and the "No" button
    const nameElem = document.getElementById("name");
    if(nameElem) nameElem.remove();
    
    const noBtn = document.getElementById("no-button");
    if(noBtn) noBtn.remove();

    // Create celebration image
    const celebrationImg = document.createElement("img");
    celebrationImg.src = "images/dance.gif";
    celebrationImg.className = "image pulse-animation";

    // Replace current media (could be video or the original image)
    const currentMedia = document.querySelector(".image");
    if (currentMedia) {
        currentMedia.parentNode.replaceChild(celebrationImg, currentMedia);
    }

    // Create an audio element to play the sound
    const audioElement = document.createElement("audio");
    audioElement.src = "./Minions Cheering.mp4";
    audioElement.preload = "auto";
    audioElement.play().catch(e => console.error("Audio playback failed:", e));

    // Update the text content
    const questionElem = document.getElementById("question");
    questionElem.textContent = `Yay! See you on the 14th, ${userName === "Beautiful" ? "Princess" : userName}! ❤️`;
    questionElem.style.display = "block";
    questionElem.style.fontStyle = "normal";
    
    // Remove the "Yes" button
    document.getElementById("yesButton").remove();
    
    createHearts();
  }
}

function moveButton(button) {
    const padding = 20;
    const maxWidth = window.innerWidth - button.offsetWidth - padding;
    const maxHeight = window.innerHeight - button.offsetHeight - padding;

    const randomX = Math.max(padding, Math.floor(Math.random() * maxWidth));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxHeight));

    button.style.left = randomX + "px";
    button.style.top = randomY + "px";
    button.style.zIndex = "999";
}

function createHearts() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.innerHTML = "❤️";
            heart.className = "floating-heart";
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.animationDuration = (Math.random() * 3 + 2) + "s";
            heart.style.fontSize = (Math.random() * 20 + 20) + "px";
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 5000);
        }, i * 100);
    }
}
