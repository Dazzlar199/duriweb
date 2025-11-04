// Carousel functionality
const carousel = document.querySelector(".members-carousel");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
const memberItems = document.querySelectorAll(".member-item");

let currentIndex = 0;
let autoSlideInterval;
const itemWidth = 360; // 320px + 40px gap

function updateCarousel() {
  if (carousel) {
    carousel.scrollTo({
      left: currentIndex * itemWidth,
      behavior: "smooth",
    });
  }
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % memberItems.length;
  updateCarousel();
}

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 4000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateCarousel();
    stopAutoSlide();
    setTimeout(startAutoSlide, 5000);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % memberItems.length;
    updateCarousel();
    stopAutoSlide();
    setTimeout(startAutoSlide, 5000);
  });
}

// Start auto slide
if (memberItems.length > 0) {
  startAutoSlide();

  // Pause on hover
  carousel?.addEventListener("mouseenter", stopAutoSlide);
  carousel?.addEventListener("mouseleave", startAutoSlide);
}

// Mouse parallax effect for member items
memberItems.forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    const imageWrapper = item.querySelector(".member-image-wrapper");
    if (imageWrapper) {
      imageWrapper.style.transform = `
        translateY(-30px) 
        scale(1.08) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
      `;
    }
  });

  item.addEventListener("mouseleave", () => {
    const imageWrapper = item.querySelector(".member-image-wrapper");
    if (imageWrapper) {
      imageWrapper.style.transform = "";
    }
  });
});

// Scroll animation for sections
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.querySelectorAll(".news-item, .schedule-item").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

// Music Player functionality
const audioPlayer = document.getElementById("audio-player");
const playPauseBtn = document.querySelector(".play-pause-btn");
const prevBtnPlayer = document.querySelector(".prev-btn");
const nextBtnPlayer = document.querySelector(".next-btn");
const progressBar = document.querySelector(".progress-fill");
const progressBarContainer = document.querySelector(".progress-bar");
const currentTimeEl = document.querySelector(".current-time");
const totalTimeEl = document.querySelector(".total-time");
const playIcon = document.querySelector(".play-icon");
const pauseIcon = document.querySelector(".pause-icon");

let isPlaying = false;

// Mock playlist (실제로는 여러 곡 리스트)
const playlist = [
  { title: "Live With U", artist: "LIV U", duration: "3:45" },
  { title: "New Beginning", artist: "LIV U", duration: "4:12" },
  { title: "Together", artist: "LIV U", duration: "3:28" },
];
let currentTrackIndex = 0;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function updateTrackInfo() {
  const track = playlist[currentTrackIndex];
  const titleEl = document.querySelector(".track-title");
  const artistEl = document.querySelector(".track-artist");
  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = track.artist;
  if (totalTimeEl) totalTimeEl.textContent = track.duration;
}

function updateProgress() {
  if (audioPlayer && audioPlayer.duration) {
    const progress =
      (audioPlayer.currentTime / audioPlayer.duration) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (currentTimeEl)
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  }
}

function togglePlayPause() {
  if (isPlaying) {
    if (audioPlayer) audioPlayer.pause();
    if (playIcon) playIcon.style.display = "inline";
    if (pauseIcon) pauseIcon.style.display = "none";
  } else {
    // 실제 음원이 있으면 재생, 없으면 시뮬레이션
    if (audioPlayer && audioPlayer.src && audioPlayer.src !== "#") {
      audioPlayer.play();
    } else {
      // 시뮬레이션: 진행바 애니메이션
      simulatePlayback();
    }
    if (playIcon) playIcon.style.display = "none";
    if (pauseIcon) pauseIcon.style.display = "inline";
  }
  isPlaying = !isPlaying;
}

let playbackInterval;

function simulatePlayback() {
  const duration = 225; // 3:45 in seconds
  let currentTime = 0;
  if (playbackInterval) clearInterval(playbackInterval);
  playbackInterval = setInterval(() => {
    if (!isPlaying) {
      clearInterval(playbackInterval);
      return;
    }
    currentTime += 1;
    const progress = (currentTime / duration) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);

    if (currentTime >= duration) {
      clearInterval(playbackInterval);
      isPlaying = false;
      if (playIcon) playIcon.style.display = "inline";
      if (pauseIcon) pauseIcon.style.display = "none";
      if (progressBar) progressBar.style.width = "0%";
      if (currentTimeEl) currentTimeEl.textContent = "0:00";
    }
  }, 1000);
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  updateTrackInfo();
  if (progressBar) progressBar.style.width = "0%";
  if (currentTimeEl) currentTimeEl.textContent = "0:00";
  if (isPlaying) {
    isPlaying = false;
    togglePlayPause();
  }
}

function prevTrack() {
  currentTrackIndex =
    (currentTrackIndex - 1 + playlist.length) % playlist.length;
  updateTrackInfo();
  if (progressBar) progressBar.style.width = "0%";
  if (currentTimeEl) currentTimeEl.textContent = "0:00";
  if (isPlaying) {
    isPlaying = false;
    togglePlayPause();
  }
}

// Progress bar click
if (progressBarContainer) {
  progressBarContainer.addEventListener("click", (e) => {
    if (audioPlayer && audioPlayer.duration) {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      audioPlayer.currentTime = percentage * audioPlayer.duration;
      updateProgress();
    }
  });
}

// Event listeners
if (playPauseBtn) {
  playPauseBtn.addEventListener("click", togglePlayPause);
}
if (prevBtnPlayer) {
  prevBtnPlayer.addEventListener("click", prevTrack);
}
if (nextBtnPlayer) {
  nextBtnPlayer.addEventListener("click", nextTrack);
}
if (audioPlayer) {
  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener("loadedmetadata", () => {
    if (totalTimeEl)
      totalTimeEl.textContent = formatTime(audioPlayer.duration);
  });
  audioPlayer.addEventListener("ended", () => {
    isPlaying = false;
    if (playIcon) playIcon.style.display = "inline";
    if (pauseIcon) pauseIcon.style.display = "none";
    if (progressBar) progressBar.style.width = "0%";
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
  });
}

// Initialize
updateTrackInfo();

