// JavaScript (app.js)
window.onload = function() {
    const fileInput = document.getElementById('audio-file');
    const audioPlayer = document.getElementById('audio-player');
    const canvas = document.getElementById('audio-visualizer');
    const context = canvas.getContext('2d');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    document.getElementById('upload-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const file = fileInput.files[0];
        audioPlayer.src = URL.createObjectURL(file);
        const source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        visualize();
    });

    audioPlayer.onplay = function() {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    };

    function visualize() {
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        context.clearRect(0, 0, WIDTH, HEIGHT);

        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            context.fillStyle = 'rgb(0, 0, 0)';
            context.fillRect(0, 0, WIDTH, HEIGHT);
            const barWidth = (WIDTH / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for(let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                context.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
                con