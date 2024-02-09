const list = document.querySelector('.music-list .items')
const audio = document.querySelector('.music-player audio')
const audioSrc = document.querySelector('.music-player audio source')
// audio.play()
const currentNameSong = document.querySelector('.right-section .description h3')
const currentNameSinger = document.querySelector('.right-section .description h5')
const currentAvt = document.querySelector('.right-section .song-info img')

const playBtn = document.querySelector('.player-actions .play-button')
const repeatBtn = document.querySelector('.player-actions .bx-repeat')
const randomBtn = document.querySelector('.player-actions .bx-transfer-alt')

const activeTime = document.querySelector('.music-player .progress p:first-child')
const durationTime = document.querySelector('.music-player .progress p:last-child')
const activeTimeLine = document.querySelector('.music-player .progress .active-time-line')
const timeLine = document.querySelector('.music-player .progress .progress-line')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Sunrise",
            singer: "Lila Rivera",
            path: "./assets/musics/song1.mp3",
            image: "assets/song-1.png",
            durationTime: "05:09",
        },
        {
            name: "Voyage",
            singer: "Tyde Brennnan",
            path: "./assets/musics/song2.mp3",
            image: "assets/song-2.png",
            durationTime: "05:02",
        },
        {
            name: "Breeze",
            singer: "Sola Kim",
            path: "./assets/musics/song3.mp3",
            image: "assets/song-3.png",
            durationTime: "04:39",
        },
        {
            name: "Twilight",
            singer: "Jett Lawsonn",
            path: "./assets/musics/song4.mp3",
            image: "assets/song-4.png",
            durationTime: "04:43",
        },
        
    ],
    formatTime: function(seconds) {
        let minutes = Math.floor(seconds / 60)
        let remainSeconds = Math.floor(seconds % 60)

        if (minutes <= 9) {
            minutes = '0' + minutes
        }
        if (remainSeconds <= 9) {
            remainSeconds = '0' + remainSeconds
        }
        
        return minutes + ':' + remainSeconds
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function() {
        currentNameSong.textContent = this.currentSong.name
        currentNameSinger.textContent = this.currentSong.singer
        currentAvt.src = this.currentSong.image

        audio.src = this.currentSong.path
        durationTime.textContent = this.formatTime(audio.duration)

        audio.addEventListener('loadedmetadata', function() {
            durationTime.textContent = this.formatTime(audio.duration);
        }.bind(this));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="item ${index === this.currentIndex ? 'active-song' : ''}" data-index="${index}">
                <div class="info">
                    <p>01</p>
                    <img src="${song.image}">
                    <div class="details">
                        <h5>${song.name}</h5>
                        <p>${song.singer}</p>
                    </div>
                </div>
                <div class="actions">
                    <p>${song.durationTime}</p>
                    <div class="icon">
                        <i class='bx bxs-right-arrow'></i>
                        <i class="fa-solid fa-pause"></i>
                    </div>
                    <i class='bx bxs-plus-square'></i>
                </div>
            </div>
            `
        })

        list.innerHTML = htmls.join("\n")
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    preSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.render()
        this.loadCurrentSong()
    },
    handleEvent: function() {
        const _this = this

        // Phát nhạc, dừng nhạc
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

        }
        audio.onplay = function(){
            _this.isPlaying = true
            playBtn.classList.add('playing')
        }

        audio.onpause = function(){
            _this.isPlaying = false
            playBtn.classList.remove('playing')
        }


        // Cập nhật thanh thời gian
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const percent = audio.currentTime / audio.duration
                // console.log(percent)
                // console.log("seconds: ", Math.floor(percent * audio.duration))
                // console.log(Math.floor(percent * 100))
                activeTimeLine.style.width = `${Math.floor(percent * 100)}%`

                let currentTime = _this.formatTime(audio.currentTime)
                let duration = _this.formatTime(audio.duration)

                activeTime.textContent = currentTime
            }
        }


        // Tua thanh thời gian
        timeLine.onclick = function(event) {
            let clickX = event.clientX
            let left = this.offsetLeft
            let distance = clickX - left

            let percent = distance / timeLine.offsetWidth
            let duration = audio.duration
            audio.currentTime = percent * duration
            
        }
        

        // Phát ngẫu nhiên hoặc lặp lại
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            this.classList.toggle('active-button', _this.isRandom)
            
            let repeatBtn = document.querySelector('.player-actions .bx-repeat.active-button')
            if (repeatBtn) {
                _this.isRepeat = !_this.isRepeat
                repeatBtn.classList.remove('active-button')
            }
        }
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            this.classList.toggle('active-button', _this.isRepeat)

            let randomBtn = document.querySelector('.player-actions .bx-transfer-alt.active-button')
            if (randomBtn) {
                _this.isRandom = !_this.isRandom
                randomBtn.classList.remove('active-button')
            }
        }


        // Nhạc kế thúc
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else if (_this.isRandom) {
                _this.playRandomSong()
                audio.play()
            }
             else {
                _this.nextSong()
                audio.play()
            }
        }

        // Tùy chọn nhạc
        list.onclick = function(event) {
            const musicClicked = event.target.closest('.item')
            const option = event.target.closest('.icon')
            if (musicClicked && !option) {
                _this.currentIndex = Number(musicClicked.getAttribute('data-index'))
                _this.loadCurrentSong()
                _this.render()
                audio.load()
                audio.play()
            }
        }

    },
    
    start: function() {
        

        this.render()
        this.defineProperties()
        this.loadCurrentSong()
        this.handleEvent()
        // audio.play() 
        
    }
}


app.start()
