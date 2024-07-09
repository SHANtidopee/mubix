const main_video = document.querySelector('.main-video video')
const main_video_title = document.querySelector('.main-video .title')
const video_playlist = document.querySelector('.video-playlist .videos')

let data = [
    {
        'id': 'a1',
        'title': 'manipulate text background',
        'name': 'manipulate text background.mp4',
        'duration': '2:47',
    },
    {
        'id': 'a2',
        'title': 'manipulate text background2',
        'name': 'manipulate text background.mp4',
        'duration': '2:47',
    },
    {
        'id': 'a3',
        'title': 'manipulate text background3',
        'name': 'manipulate text background.mp4',
        'duration': '2:47',
    },
    {
        'id': 'a4',
        'title': 'manipulate text background4',
        'name': 'manipulate text background.mp4',
        'duration': '2:48',
    },
    {
        'id': 'a5',
        'title': 'manipulate text backgroun5',
        'name': 'manipulate text background.mp4',
        'duration': '2:47',
    },
    {
        'id': 'a6',
        'title': 'manipulate text background6',
        'name': 'manipulate text background.mp4',
        'duration': '2:47',
    },
];

data.forEach((video,i)=> {
    let video_element = `
        <div class="video" data-id="${video.id}">
            <img src="img assets/play.png">
            <p>0${i}. </p>
            <h3 class="title">${video.title}</h3>
            <p class="time">${video.duration}</p>
        </div>
    `;
    video_playlist.innerHTML += video_element;
})

let videos = document.querySelectorAll('.video');

videos.forEach(selected_video=>{
    selected_video.onlick = () => {

        for(all_videos of videos){
            all_videos.classList.remove('active');
            all_videos.querySelector('img').src = 'img assets/play.png';
        }
        selected_video.classList.add('active');
        selected_video.querySelector('img').src = 'img assets/pause.png';

        let match_video = data.find(video=> video.id == selected_video.dataset.id);
        console
    }
});