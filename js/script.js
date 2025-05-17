// main.js

function myFunctionMail() {
  const email = "xianyao.wei.de@gmail.com";
  const subject = "Hello from the Portfolio Website";
  const body = " ";
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}

let isVisible = true;
const box = document.getElementById("firstpage");

function myFunctionStart() {
  if (isVisible) {
    box.classList.remove("fade-in");
    box.classList.add("fade-out");

    setTimeout(() => {
      box.classList.add("hidden");
    }, 500);
  } else {
    box.classList.remove("hidden");
    box.classList.remove("fade-out");
    box.classList.add("fade-in");
  }

  isVisible = !isVisible;
}

window.addEventListener("load", () => {
  box.classList.add("fade-in");
});

function showError(initiator, ...args) {
  CABLES.logErrorConsole("[" + initiator + "]", ...args);
}

function patchInitialized(patch) {}

function patchFinishedLoading(patch) {}

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

window.addEventListener('resize', function () {
  const canvas = document.getElementById('glcanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
window.dispatchEvent(new Event('resize'));

///////////////////////////
//windowsxp style scripts//
///////////////////////////

const windows = {};
let zIndexCounter = 1000;

function isMobile() {
  return window.innerWidth <= 768;
}

function createWindow(id) {
  const win = document.createElement('div');
  win.className = 'xpWindow';
  win.style.zIndex = ++zIndexCounter;

  const titlebar = document.createElement('div');
  titlebar.className = 'titlebar';
  titlebar.innerHTML = `
        <div class="title">Window ${id}</div>
        <div class="controls">
          <button class="minimizeBtn"></button>
          <button class="maximizeBtn"></button>
          <button class="closeBtn"></button>
        </div>
      `;
  win.appendChild(titlebar);

  const content = document.createElement('div');
  content.className = 'content';

  const template = document.querySelector(`#window${id}-template`);
  if (template) {
    content.innerHTML = template.innerHTML;
  }

  if (id === 1) {
    const imageList = content.querySelector('#imageList');
    const videoView = content.querySelector('#videoView');
    const ytVideo = content.querySelector('#ytVideo');
    const videoText = content.querySelector('#videoText');
    const backBtn = content.querySelector('#backBtn');

    imageList.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => {
        const videoId = img.dataset.video;
        ytVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        videoText.textContent = `This is some description text for ${img.alt}.`;
        imageList.style.display = 'none';
        videoView.style.display = 'flex';
      });
    });

    backBtn.addEventListener('click', () => {
      ytVideo.src = '';
      videoView.style.display = 'none';
      imageList.style.display = 'flex';
    });
  }

  win.appendChild(content);

  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle br';
  win.appendChild(resizeHandle);

  document.body.appendChild(win);

  // Custom sizes and positions per window ID
  let width, height, offsetX, offsetY;

  if (id === 1) {
    width = 800;
    height = 500;
    offsetX = -100;
    offsetY = -50;
  } else if (id === 2) {
    width = 500;
    height = 350;
    offsetX = 100;
    offsetY = 50;
  } else {
    width = 600;
    height = 400;
    offsetX = 30 * (id - 1);
    offsetY = 30 * (id - 1);
  }

  win.style.width = width + 'px';
  win.style.height = height + 'px';
  win.style.left = (window.innerWidth - width) / 2 + offsetX + 'px';
  win.style.top = (window.innerHeight - height) / 2 + offsetY + 'px';

  if (!isMobile()) {
    let isDragging = false, offsetX = 0, offsetY = 0;
    titlebar.addEventListener('mousedown', e => {
      if (e.target.closest('.controls')) return;
      isDragging = true;
      const rect = win.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      win.style.zIndex = ++zIndexCounter;
    });

    window.addEventListener('mousemove', e => {
      if (isDragging) {
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        x = Math.max(0, Math.min(x, window.innerWidth - win.offsetWidth));
        y = Math.max(0, Math.min(y, window.innerHeight - win.offsetHeight));
        win.style.left = x + 'px';
        win.style.top = y + 'px';
      }
    });

    window.addEventListener('mouseup', () => isDragging = false);
  }

  if (!isMobile()) {
    let resizing = false, startX, startY, startWidth, startHeight;
    resizeHandle.addEventListener('mousedown', e => {
      e.preventDefault();
      resizing = true;
      const rect = win.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startWidth = rect.width;
      startHeight = rect.height;
      win.style.zIndex = ++zIndexCounter;
    });

    window.addEventListener('mousemove', e => {
      if (resizing) {
        const newWidth = Math.max(300, startWidth + (e.clientX - startX));
        const newHeight = Math.max(200, startHeight + (e.clientY - startY));
        win.style.width = newWidth + 'px';
        win.style.height = newHeight + 'px';
      }
    });

    window.addEventListener('mouseup', () => resizing = false);
  }

  titlebar.querySelector('.closeBtn').onclick = () => win.style.display = 'none';
  titlebar.querySelector('.minimizeBtn').onclick = () => win.style.display = 'none';
  titlebar.querySelector('.maximizeBtn').onclick = () => {
    win.classList.toggle('maximized');
  };

  return win;
}

function toggleWindow(id) {
  if (!windows[id]) {
    windows[id] = createWindow(id);
  }

  const win = windows[id];
  const isVisible = win.style.display !== 'none' && win.style.display !== '';

  if (isVisible) {
    win.style.display = 'none';
  } else {
    win.style.display = 'flex';
    win.style.zIndex = ++zIndexCounter;

    const content = win.querySelector('.content');
    if (content) {
      content.scrollTop = 0;
      if (id === 1) {
        const imageList = content.querySelector('#imageList');
        const videoView = content.querySelector('#videoView');
        const ytVideo = content.querySelector('#ytVideo');
        if (imageList && videoView && ytVideo) {
          imageList.style.display = 'flex';
          videoView.style.display = 'none';
          ytVideo.src = '';
        }
      }
    }
  }
}

function myFunctionWork() {
  location.hash = 'work';
  toggleWindow(1);
}
function myFunctionAbout() {
  location.hash = 'about';
  toggleWindow(2); 
}

window.addEventListener('resize', () => {
  Object.values(windows).forEach(win => {
    if (isMobile()) {
      win.classList.add('maximized');
    }
  });
});