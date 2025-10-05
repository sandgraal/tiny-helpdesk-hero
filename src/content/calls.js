/**
 * Placeholder call content used by the greybox conversation engine.
 * TODO: Replace with modular persona/problem/twist pools.
 */

export const placeholderCalls = [
  {
    id: 'microscopic-icons',
    persona: 'Overwhelmed Designer',
    prompt: 'Caller: My desktop icons are microscopic. Can empathy make them bigger?',
    options: [
      { text: 'Walk them through display scaling settings.', correct: true },
      { text: 'Suggest they squint creatively.', correct: false },
      { text: 'Tell them it is a feature, not a bug.', correct: false },
    ],
    empathyWin: 'They breathe easier as icons pop back into focus.',
    empathyFail: 'They agree to wear three pairs of glasses. Oops.',
  },
  {
    id: 'tiny-usb',
    persona: 'Sleep-Deprived Gamer',
    prompt: 'Caller: My USB port shrank. How do I reconnect my controller?',
    options: [
      { text: 'Remind them to flip the cable and try again gently.', correct: true },
      { text: 'Recommend resizing the port with pliers.', correct: false },
      { text: 'Tell them to yell at the console until it grows.', correct: false },
    ],
    empathyWin: 'They plug in, sigh with relief, and promise to hydrate.',
    empathyFail: 'They search the junk drawer for a shrink ray.',
  },
  {
    id: 'loopless-gif',
    persona: 'Office Mascot Coordinator',
    prompt: 'Caller: The tiny cat gif stopped looping and morale is tanking.',
    options: [
      { text: 'Coach them to refresh the file and verify autoplay.', correct: true },
      { text: 'Tell them to poke the monitor until it works.', correct: false },
      { text: 'Advise replacing the gif with a spreadsheet.', correct: false },
    ],
    empathyWin: 'The cat loops again and the office cheers.',
    empathyFail: 'They schedule an all-hands about feline commitment.',
  },
];
