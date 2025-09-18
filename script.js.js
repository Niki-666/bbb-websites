// ===== Existing Birthday Countdown & Confetti =====
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const birthdayMonth = 9; // October (0-indexed)
const birthdayDay = 22;

const thisYearBirthday = new Date(currentYear, birthdayMonth, birthdayDay);
const nextYearBirthday = new Date(currentYear + 1, birthdayMonth, birthdayDay);

const birthdayDate = currentDate > thisYearBirthday ? nextYearBirthday : thisYearBirthday;

// Countdown timer
function updateCountdown() {
    const currentDate = new Date();
    const timeLeft = birthdayDate - currentDate;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        celebrateBirthday();
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Confetti animation
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    const colors = ['#ff1493', '#00bfff', '#9932cc', '#ffff00', '#ff4500', '#32cd32'];

    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * 5;

        confetti.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            top: -${size}px;
            left: ${left}vw;
            opacity: 0.7;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: fall ${duration}s ease-in infinite;
            animation-delay: ${delay}s;
        `;

        confettiContainer.appendChild(confetti);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Gallery interactions
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const video = item.querySelector('video');
            if (video) video.muted = true, video.play();
        });
        item.addEventListener('mouseleave', () => {
            const video = item.querySelector('video');
            if (video) video.pause();
        });

        const video = item.querySelector('video');
        if (video) {
            video.addEventListener('volumechange', () => {
                if (!video.muted) video.muted = true;
            });
        }
    });
}

// Celebrate birthday
function celebrateBirthday() {
    alert('Happy Birthday Hellen!');
    document.body.classList.add('birthday-mode');
    createConfetti();
}

// Unmute birthday song
function unmuteAudio() {
    const audio = document.getElementById('birthdayAudio');
    audio.muted = false;
    audio.play();
}

// Play prayer audio
function playPrayer() {
    const audio = document.getElementById('prayerAudio');
    audio.muted = false;
    audio.play();
}

// ===== DOM Loaded =====
document.addEventListener('DOMContentLoaded', () => {
    createConfetti();
    initGallery();

    // Autoplay birthday song & prayer muted
    const birthdayAudio = document.getElementById('birthdayAudio');
    if(birthdayAudio){ birthdayAudio.muted = true; birthdayAudio.loop = true; birthdayAudio.play().catch(() => console.log("Autoplay blocked.")); }

    const prayerAudio = document.getElementById('prayerAudio');
    if(prayerAudio){ prayerAudio.muted = true; prayerAudio.loop = true; prayerAudio.play().catch(() => console.log("Autoplay blocked.")); }

    document.querySelectorAll('video').forEach(video => {
        video.load();
        video.muted = true;
        Object.defineProperty(video, 'muted', {
            set: function(val) { this._muted = true; HTMLMediaElement.prototype.__lookupSetter__('muted').call(this,true); },
            get: function() { return true; }
        });
    });

    // ===== Live Wishes Feature (Firestore) =====
    const submitBtn = document.getElementById('submitWish');
    const wishInput = document.getElementById('wishInput');
    const wishList = document.getElementById('wishes');

    // Reference to "wishes" collection
    const wishesRef = collection(db, "wishes");

    // Listen for real-time updates
    onSnapshot(query(wishesRef, orderBy("timestamp", "asc")), (snapshot) => {
        wishList.innerHTML = ""; // Clear current list
        snapshot.forEach((doc) => {
            const wishText = doc.data().text;
            const wishItem = document.createElement('p');
            wishItem.textContent = wishText;
            wishItem.style.background = "rgba(0,0,0,0.6)";
            wishItem.style.padding = "10px";
            wishItem.style.borderRadius = "10px";
            wishItem.style.marginBottom = "10px";
            wishList.appendChild(wishItem);
        });
    });

    // Submit new wish to Firestore
    submitBtn.addEventListener('click', async () => {
        const text = wishInput.value.trim();
        if(text !== "") {
            await addDoc(wishesRef, {
                text: text,
                timestamp: new Date()
            });
            wishInput.value = ""; // clear input
        } else {
            alert("Please write a wish before submitting!");
        }
    });

    // ===== Other code (Swiper, celebrant wish box, etc.) =====
    // ... Keep your other existing features here ...
});
