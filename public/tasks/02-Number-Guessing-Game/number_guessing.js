let secretNum, attempts = 5, prize = 100, gameOver = false;

function init() {
  secretNum = Math.floor(Math.random() * 10) + 1;
  attempts = 5;
  prize = 100;
  gameOver = false;
  document.getElementById('attempts').textContent = attempts;
  document.getElementById('prize').textContent = '$' + prize;
  document.getElementById('feedback').textContent = '';
  document.getElementById('guess').value = '';
  document.getElementById('resultBox').innerHTML = '';
  document.getElementById('gifContainer').innerHTML = '';
}

function guess() {
  if (gameOver) return;
  const input = document.getElementById('guess');
  const num = parseInt(input.value);
  if (!num || num < 1 || num > 10) {
    document.getElementById('feedback').textContent = '⚠️ Enter a valid number!';
    return;
  }

  attempts--;
  const feedback = document.getElementById('feedback');
  
  if (num === secretNum) {
    gameOver = true;
    feedback.textContent = `🎉 Correct! You won $${prize}!`;
    feedback.className = 'feedback win';
    document.getElementById('gifContainer').innerHTML = '<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTdyajJmajNqdG41YThzZ2lldHZ2dTh3aThuYW55b3Q3dnkxb2tsayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dtxA3U6yLPRW569tCu/giphy.gif" alt="celebrate">';
    document.getElementById('resultBox').innerHTML = `<p class="result-text">🏆 You guessed it in ${6-attempts} try!</p>`;
  } else {
    prize = Math.max(0, prize - 20);
    const msg = num > secretNum ? '📉 Too High!' : '📈 Too Low!';
    feedback.textContent = msg;
    
    if (attempts <= 0) {
      gameOver = true;
      feedback.textContent = `💔 Game Over! Number was ${secretNum}. Prize: $0`;
      feedback.className = 'feedback lose';
      document.getElementById('resultBox').innerHTML = `<p class="result-text">Try again!</p>`;
    } else if (prize <= 0) {
      gameOver = true;
      feedback.textContent = `💸 Prize depleted! Number was ${secretNum}`;
      feedback.className = 'feedback lose';
    }
  }
  
  document.getElementById('attempts').textContent = attempts;
  document.getElementById('prize').textContent = '$' + prize;
  input.value = '';
}

function resetGame() {
  init();
}

init();
