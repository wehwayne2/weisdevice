// main.js

function myFunctionWork() {
  console.log("Work triggered");
  const content = document.getElementById('contentBox-work');
  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
  }
}

function myFunctionAbout() {
  console.log("About triggered");
  const content = document.getElementById('contentBox-about');
  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
  }
}

function myFunctionMail() {
  const email = "xianyao.wei.de@gmail.com";
  const subject = "Hello from the website";
  const body = " ";
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}

let isVisible = true;
const box = document.getElementById("websayhiBox");

function myFunctionStart() {
  if (isVisible) {
    box.classList.remove("fade-in");
    box.classList.add("fade-out");

    setTimeout(() => {
      box.classList.add("hidden");
    }, 500); // wait for animation to finish
  } else {
    box.classList.remove("hidden");
    box.classList.remove("fade-out");
    box.classList.add("fade-in");
  }

  isVisible = !isVisible;
}

// Animate in on page load
window.addEventListener("load", () => {
  box.classList.add("fade-in");
});


function showError(initiator, ...args) {
  CABLES.logErrorConsole("[" + initiator + "]", ...args);
}

function patchInitialized(patch) {
  // Patch is ready
}

function patchFinishedLoading(patch) {
  // All assets have finished loading
}

document.addEventListener("CABLES.jsLoaded", function () {
  CABLES.patch = new CABLES.Patch({
    patch: CABLES.exportedPatch,
    prefixAssetPath: "",
    assetPath: "assets/",
    jsPath: "js/",
    glCanvasId: "glcanvas",
    glCanvasResizeToWindow: true,
    onError: showError,
    onPatchLoaded: patchInitialized,
    onFinishedLoading: patchFinishedLoading,
    canvas: { alpha: true, premultipliedAlpha: true },
    outSidefunctionWork: myFunctionWork,
    outSidefunctionMail: myFunctionMail,
    outSidefunctionAbout: myFunctionAbout,
    outSidefunctionStart: myFunctionStart,
  });
});

// Resize canvas to window
window.addEventListener('resize', function () {
  const canvas = document.getElementById('glcanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
window.dispatchEvent(new Event('resize'));