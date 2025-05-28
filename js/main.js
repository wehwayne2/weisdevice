// === UTILS ===
function isMobile() {
  return window.innerWidth <= 768;
}

// === GLOBAL STATE ===
const windows = {};
let zIndexCounter = 1000;
let isVisible = true;

// === DOM ELEMENTS ===
const firstBox = document.getElementById("firstpage");
const secondBox = document.getElementById("secondpage");

// === EMAIL HANDLER ===
function myFunctionMail() {
  const email = "xianyao.wei.de@gmail.com";
  const subject = "Hello from the Portfolio Website";
  const body = " ";
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}

// === PAGE TRANSITION ===
function myFunctionStart() {
  if (isVisible) {
    firstBox.classList.remove("fade-in");
    firstBox.classList.add("fade-out");
    setTimeout(() => firstBox.classList.add("hidden"), 500);

    secondBox.classList.remove("fade-out", "hidden");
    secondBox.classList.add("fade-in");
  } else {
    firstBox.classList.remove("hidden", "fade-out");
    firstBox.classList.add("fade-in");

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

// === REMOVE RESET WARNING ===
function myFunctionPC() {
  [firstBox, secondBox].forEach(box => {
    box.classList.remove("fade-in");
    box.classList.add("fade-out");
    setTimeout(() => box.classList.add("hidden"), 500);
  });

  Object.values(windows).forEach(win => {
    win.style.display = 'none';
  });
  isVisible = false;

  
    const mobileWarning = document.getElementById("warningwindow-mobile");
    if (mobileWarning) {
      mobileWarning.style.display = "flex";
    }
  
}

// === CABLES.GL INIT ===
function showError(initiator, ...args) {
  CABLES.logErrorConsole(`[${initiator}]`, ...args);
}

function patchInitialized(patch) { }
function patchFinishedLoading(patch) { }

document.addEventListener("CABLES.jsLoaded", () => {
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
    outSidefunctionPC: myFunctionPC,
  });
});

// === RESIZE CANVAS ===
function resizeCanvas() {
  const canvas = document.getElementById('glcanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// === WINDOW SYSTEM ===
function createWindow(id) {
  const win = document.createElement('div');
  win.className = 'xpWindow';
  win.style.zIndex = ++zIndexCounter;

  const titlebar = document.createElement('div');
  titlebar.className = 'titlebar';
  const titlebarTemplate = document.querySelector('#titlebar-template');
  const titlebarContent = titlebarTemplate.content.cloneNode(true);
  titlebarContent.querySelector('.title').textContent = id === 1 ? 'WORK' : id === 2 ? 'ABOUT' : `Window ${id}`;
  titlebar.appendChild(titlebarContent);
  win.appendChild(titlebar);

  const content = document.createElement('div');
  content.className = 'content';
  const template = document.querySelector(`#window${id}-template`);
  if (template) content.innerHTML = template.innerHTML;

  if (id === 1) {
    setupWorkWindow(content);
  }

  win.appendChild(content);

  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle br';
  win.appendChild(resizeHandle);
  document.body.appendChild(win);

  const defaultDims = {
    1: { width: 800, height: 500, left: 100, top: 100 },
    2: { width: 500, height: 350, left: 700, top: 200 },
  }[id] || { width: 600, height: 400, left: 300, top: 200 };

  const { width, height, left, top } = defaultDims;

  win.style.width = `${width}px`;
  win.style.height = `${height}px`;
  win.style.left = `${left}px`;
  win.style.top = `${top}px`;

  if (!isMobile()) enableDrag(win, titlebar);
  if (!isMobile()) enableResize(win, resizeHandle);

  const stopMedia = () => stopMediaInWindow(id);
  titlebar.querySelector('.closeBtn').onclick = () => { win.style.display = 'none'; stopMedia(); };
  titlebar.querySelector('.minimizeBtn').onclick = () => { win.style.display = 'none'; stopMedia(); };
  titlebar.querySelector('.maximizeBtn').onclick = () => win.classList.toggle('maximized');

  return win;
}

function toggleWindow(id) {
  if (!windows[id]) windows[id] = createWindow(id);
  const win = windows[id];
  const isVisible = win.style.display !== 'none' && win.style.display !== '';

  win.style.display = isVisible ? 'none' : 'flex';
  if (!isVisible) {
    win.style.zIndex = ++zIndexCounter;
    const content = win.querySelector('.content');
    if (id === 1 && content) {
      content.querySelector('#ytVideo').src = '';
      content.querySelector('#videoView').style.display = 'none';
      content.querySelector('#imageList').style.display = 'flex';
    }
    if (isMobile()) win.classList.add('maximized');
    else win.classList.remove('maximized');
    content?.scrollTo(0, 0);
  }
}

function myFunctionWork() { 
  toggleWindow(1); 
  console.log("myFunctionWork triggered");
}
function myFunctionAbout() { 
  toggleWindow(2);
  console.log("myFunctionAbout triggered");
}

// === WORK WINDOW SETUP ===
function setupWorkWindow(content) {
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
    const descriptionTemplate = templateId ? document.getElementById(templateId) : null;
    const description = descriptionTemplate ? descriptionTemplate.innerHTML : img.alt || '';

    ytVideo.src = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : '';
    ytVideo.style.display = videoId ? 'block' : 'none';
    videoText.innerHTML = description;

    imageList.style.display = 'none';
    videoView.style.display = 'flex';
    currentIndex = index;

    history.pushState({ page: `video-${index}` }, '', `#work/video${index + 1}`);
  }

  items.forEach((img, index) => img.addEventListener('click', () => showItemAt(index)));
  backBtn.addEventListener('click', () => {
    ytVideo.src = '';
    videoView.style.display = 'none';
    imageList.style.display = 'flex';
    currentIndex = -1;
    history.pushState({ page: 'work-root' }, '', '#work');
  });
  nextBtn.addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % items.length;
    showItemAt(nextIndex);
  });
}

// === UTILITY FUNCTIONS ===
function stopMediaInWindow(id) {
  if (id !== 1) return;
  const win = windows[id];
  const content = win?.querySelector('.content');
  if (!content) return;
  content.querySelector('#ytVideo').src = '';
  content.querySelector('#videoView').style.display = 'none';
  content.querySelector('#imageList').style.display = 'flex';
}

function enableDrag(win, titlebar) {
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
    if (!isDragging) return;
    const x = Math.max(0, Math.min(e.clientX - dragOffsetX, window.innerWidth - win.offsetWidth));
    const y = Math.max(0, Math.min(e.clientY - dragOffsetY, window.innerHeight - win.offsetHeight));
    win.style.left = `${x}px`;
    win.style.top = `${y}px`;
  });

  window.addEventListener('mouseup', () => isDragging = false);
}

function enableResize(win, handle) {
  let resizing = false, startX, startY, startWidth, startHeight;

  handle.addEventListener('mousedown', e => {
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
    if (!resizing) return;
    win.style.width = `${Math.max(300, startWidth + (e.clientX - startX))}px`;
    win.style.height = `${Math.max(200, startHeight + (e.clientY - startY))}px`;
  });

  window.addEventListener('mouseup', () => resizing = false);
}

// === ADAPTIVE WINDOW BEHAVIOR ON RESIZE ===
window.addEventListener('resize', () => {
  Object.values(windows).forEach(win => {
    if (isMobile()) {
      win.classList.add('maximized');
    }
  });
});