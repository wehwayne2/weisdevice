// === CONFIGURATION ===
function isMobile() {
  return window.innerWidth <= 768;
}

// === EMAIL HANDLER ===
function myFunctionMail() {
  const email = "xianyao.wei.de@gmail.com";
  const subject = "Hello from the Portfolio Website";
  const body = " ";
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}

// === FIRST PAGE ANIMATION ===
let isVisible = true;
const firstBox = document.getElementById("firstpage");
const secondBox = document.getElementById("secondpage");

function myFunctionStart() {
  if (isVisible) {
    //hide firstpage
    firstBox.classList.remove("fade-in");
    firstBox.classList.add("fade-out");
    setTimeout(() => {
      firstBox.classList.add("hidden");
    }, 500);
    //show secondpage
    secondBox.classList.remove("fade-out", "hidden");
    secondBox.classList.add("fade-in");
  } else {
    //show firstpage
    firstBox.classList.remove("hidden", "fade-out");
    firstBox.classList.add("fade-in");

    //hide secondpage
    secondBox.classList.remove("fade-in");
    secondBox.classList.add("fade-out");
    setTimeout(() => secondBox.classList.add("hidden"), 500);
  }
  isVisible = !isVisible;
}

window.addEventListener("load", () => {
  firstBox.classList.add("fade-in");
  secondBox.classList.add("hidden");
});

// === CABLES.GL PATCH INIT ===
function showError(initiator, ...args) {
  CABLES.logErrorConsole("[" + initiator + "]", ...args);
}

function patchInitialized(patch) { }
function patchFinishedLoading(patch) { }

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

// === RESIZE GL CANVAS ===
function resizeCanvas() {
  const canvas = document.getElementById('glcanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// === XP-STYLE WINDOW SYSTEM ===

const windows = {};
let zIndexCounter = 1000;

function createWindow(id) {
  const win = document.createElement('div');
  win.className = 'xpWindow';
  win.style.zIndex = ++zIndexCounter;

  // Titlebar
  const titlebar = document.createElement('div');
  titlebar.className = 'titlebar';
  const windowTitle = id === 1 ? 'WORK' : id === 2 ? 'ABOUT' : `Window ${id}`;


  //titlebar-template append
  const titlebarTemplate = document.querySelector('#titlebar-template');
  const titlebarContent = titlebarTemplate.content.cloneNode(true);

  // Replace the title text dynamically
  titlebarContent.querySelector('.title').textContent = windowTitle;

  // Append to titlebar div
  titlebar.appendChild(titlebarContent);

  win.appendChild(titlebar);

  // Content
  const content = document.createElement('div');
  content.className = 'content';
  const template = document.querySelector(`#window${id}-template`);
  if (template) content.innerHTML = template.innerHTML;

  // Video logic for WORK window
  if (id === 1) {
    const imageList = content.querySelector('#imageList');
    const videoView = content.querySelector('#videoView');
    const ytVideo = content.querySelector('#ytVideo');
    const videoText = content.querySelector('#videoText');
    const backBtn = content.querySelector('#backBtn');
    const nextBtn = content.querySelector('#nextBtn');

    const items = Array.from(imageList.querySelectorAll('img'));
    let currentIndex = -1;

    function showItemAt(index) {
      const img = items[index];
      const videoId = img.dataset.video;
      const templateId = img.dataset.descriptionTemplate;
      const descriptionTemplate = templateId
        ? document.getElementById(templateId)
        : null;
      const description = descriptionTemplate
        ? descriptionTemplate.innerHTML
        : img.alt || '';

      if (videoId) {
        ytVideo.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
        ytVideo.style.display = 'block';
      } else {
        ytVideo.src = '';
        ytVideo.style.display = 'none';
      }

      videoText.innerHTML = description;
      imageList.style.display = 'none';
      videoView.style.display = 'flex';
      currentIndex = index;
    }

    items.forEach((img, index) => {
      img.addEventListener('click', () => showItemAt(index));
    });

    backBtn.addEventListener('click', () => {
      ytVideo.src = '';
      videoView.style.display = 'none';
      imageList.style.display = 'flex';
      currentIndex = -1;
    });

    nextBtn.addEventListener('click', () => {
      let nextIndex = (currentIndex + 1) % items.length;
      showItemAt(nextIndex);
    });
  }
  win.appendChild(content);

  // Resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle br';
  win.appendChild(resizeHandle);

  document.body.appendChild(win);

  // Window positioning
  let width = 600, height = 400, offsetX = 0, offsetY = 0;
  if (id === 1) { width = 800; height = 500; offsetX = -100; offsetY = -50; }
  if (id === 2) { width = 500; height = 350; offsetX = 100; offsetY = 50; }

  win.style.width = `${width}px`;
  win.style.height = `${height}px`;
  win.style.left = `${(window.innerWidth - width) / 2 + offsetX}px`;
  win.style.top = `${(window.innerHeight - height) / 2 + offsetY}px`;

  // Dragging
  if (!isMobile()) {
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
    titlebar.addEventListener('mousedown', e => {
      if (e.target.closest('.controls')) return;
      isDragging = true;
      const rect = win.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      win.style.zIndex = ++zIndexCounter;
    });
    window.addEventListener('mousemove', e => {
      if (isDragging) {
        let x = Math.max(0, Math.min(e.clientX - dragOffsetX, window.innerWidth - win.offsetWidth));
        let y = Math.max(0, Math.min(e.clientY - dragOffsetY, window.innerHeight - win.offsetHeight));
        win.style.left = `${x}px`;
        win.style.top = `${y}px`;
      }
    });
    window.addEventListener('mouseup', () => isDragging = false);
  }

  // Resizing
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
        win.style.width = `${Math.max(300, startWidth + (e.clientX - startX))}px`;
        win.style.height = `${Math.max(200, startHeight + (e.clientY - startY))}px`;
      }
    });
    window.addEventListener('mouseup', () => resizing = false);
  }

  // Controls
  function stopMediaInWindow(id) {
    const win = windows[id];
    const content = win?.querySelector('.content');
    if (!content || id !== 1) return;

    const ytVideo = content.querySelector('#ytVideo');
    const videoView = content.querySelector('#videoView');
    const imageList = content.querySelector('#imageList');

    if (ytVideo) ytVideo.src = '';
    if (videoView) videoView.style.display = 'none';
    if (imageList) imageList.style.display = 'flex';
  }

  titlebar.querySelector('.closeBtn').onclick = () => {
    win.style.display = 'none';
    stopMediaInWindow(id);
  };
  titlebar.querySelector('.minimizeBtn').onclick = () => {
    win.style.display = 'none';
    stopMediaInWindow(id);
  };
  titlebar.querySelector('.maximizeBtn').onclick = () => win.classList.toggle('maximized');
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
    if (content && id === 1) {
      const imageList = content.querySelector('#imageList');
      const videoView = content.querySelector('#videoView');
      const ytVideo = content.querySelector('#ytVideo');
      if (imageList && videoView && ytVideo) {
        imageList.style.display = 'flex';
        videoView.style.display = 'none';
        ytVideo.src = '';
      }
    }
    if (content) content.scrollTop = 0;
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

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  Object.values(windows).forEach(win => {
    if (isMobile()) {
      win.classList.add('maximized');
    }
  });
});

