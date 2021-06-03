// Definitions
const text = document.getElementById("text");
const emotion = document.getElementById("emotion");
let current = 0;

// Initalize particles.js
Particles.init({
	selector: '#background',
	maxParticles: Math.round(document.body.scrollWidth / 10),
	color: '#FFFFFF',
	connectParticles: true,
});

text.focus();

text.onkeyup = () => {
	if (text.value !== ''){
		if (current !== 0) {
			clearTimeout(current);
		}
		emotion.innerHTML = '✉️';
		current = setTimeout(() => {
			fetch('/api/emoji', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify({ input: text.value })
			}).then(res => {
				res.text().then((text) => {
					emotion.innerHTML = text;
					current = 0;
				});
			}).catch(() => {
				emotion.innerHTML = '❌';
			})
		}, 1000);
	}
	else {
		emotion.innerHTML = '❓';
	}
	
}