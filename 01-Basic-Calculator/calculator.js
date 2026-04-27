function addToDisplay(value) {
  const screen = document.getElementById('screen');
  if (value === 'C') return screen.value = '';
  const ops = '+-*/';
  const last = screen.value.slice(-1);
  if (ops.includes(value) && (!screen.value || ops.includes(last))) return;
  screen.value += value;
}

function compute() {
  const screen = document.getElementById('screen');
  if (!screen.value) return;
  try {
    screen.value = String(eval(screen.value));
  } catch {
    screen.value = 'Error';
    setTimeout(() => screen.value = '', 1200);
  }
}
