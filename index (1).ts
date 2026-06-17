@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #f5f3ed;
  --bg2: #edeae0;
  --bg3: #e4e0d4;
  --card: #ffffff;
  --green: #4a7c59;
  --green-dk: #2d4a2b;
  --green-lt: #d4e8da;
  --green-xs: #edf7f0;
  --sage: #7d8471;
  --olive: #a4ac86;
  --gold: #f9a620;
  --gold-lt: #fef3d7;
  --terra: #b7472a;
  --terra-lt: #f5e0d9;
  --blue: #3a7bd5;
  --blue-lt: #ddeaff;
  --txt: #2a2c28;
  --txt2: #6b7260;
  --txt3: #a4ac86;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

html,
body {
  height: 100%;
  overscroll-behavior: none;
}

body {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--bg);
  color: var(--txt);
}

/* Page animation */
.page-enter {
  animation: fadeUp 0.25s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

/* Range input */
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  height: 5px;
  border-radius: 100px;
  background: var(--bg2);
  outline: none;
  width: 100%;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
  cursor: pointer;
}

/* Time input */
input[type='time'] {
  border: none;
  background: none;
  font-family: 'Lora', serif;
  font-weight: 700;
  color: var(--green-dk);
  text-align: center;
  outline: none;
  cursor: pointer;
}

/* Textarea */
textarea {
  font-family: 'DM Sans', system-ui, sans-serif;
}

/* Scrollbar */
::-webkit-scrollbar { width: 0; }
