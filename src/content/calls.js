/**
 * Modular call content pools used to assemble dynamic scenarios.
 * TODO: Expand each pool with additional personas, problems, and twists.
 */

export const personas = [
  {
    id: 'overwhelmed-designer',
    name: 'Mira, the Overwhelmed Designer',
    mood: 'frazzled but eager to learn',
    opener: 'Hi… everything on my desktop shrank overnight. Can you help before my launch?',
    empathyWin: 'Mira exhales, takes a sip of micro-latte, and praises your gentle coaching.',
    empathyFail: 'She drafts a meme about feeling small and ghosts the design review.',
  },
  {
    id: 'sleep-deprived-gamer',
    name: 'Dex, the Sleep-Deprived Gamer',
    mood: 'wired on energy drinks and nostalgia',
    opener: 'My USB port shrunk and the controller refuses to connect. The speedrun is doomed.',
    empathyWin: 'Dex plugs in successfully, promises to stretch, and queues up your stream.',
    empathyFail: 'He orders a questionable cable extender and tweets about tiny tech conspiracies.',
  },
  {
    id: 'mascot-coordinator',
    name: 'June, the Mascot Coordinator',
    mood: 'earnestly trying to keep team morale high',
    opener: 'Our office cat gif stopped looping. Productivity is plummeting. Help?',
    empathyWin: 'June forwards screenshots of teammates cheering for the returning cat loop.',
    empathyFail: 'She distributes a 42-slide deck about gifs and everyone silently logs off.',
  },
  {
    id: 'miniature-roboticist',
    name: 'Rafi, the Miniature Roboticist',
    mood: 'analytical but anxious',
    opener: 'My mic is stuck on whisper mode. The robot swarm can’t hear my pep talks.',
    empathyWin: 'Rafi’s robots spin a celebratory circle while he thanks you sincerely.',
    empathyFail: 'He resorts to interpretive dance instructions with mixed results.',
  },
];

export const problems = [
  {
    id: 'display-scaling',
    summary: 'Icons shrank after a resolution change.',
    guidance: 'Guide them through display scaling settings.',
    incorrect: [
      'Suggest taping a magnifying glass to the monitor.',
      'Recommend buying a second monitor to feel “larger.”',
    ],
    empathyWin: 'Their desktop becomes readable again.',
    empathyFail: 'They consider printing their desktop at poster size.',
  },
  {
    id: 'usb-orientation',
    summary: 'USB connector feels mismatched to the port.',
    guidance: 'Remind them to flip the cable and insert gently.',
    incorrect: [
      'Encourage widening the port with pliers.',
      'Suggest yelling at the console until it grows.',
    ],
    empathyWin: 'The connection clicks in with satisfying ease.',
    empathyFail: 'They start researching port enlargement surgeries.',
  },
  {
    id: 'gif-refresh',
    summary: 'Ambient morale gif stopped looping.',
    guidance: 'Coach them to refresh the file and confirm autoplay.',
    incorrect: [
      'Tell them to poke the monitor repeatedly.',
      'Recommend replacing the gif with a spreadsheet.',
    ],
    empathyWin: 'The loop restarts and morale skyrockets.',
    empathyFail: 'They schedule an emergency morale summit instead.',
  },
  {
    id: 'mic-volume',
    summary: 'Microphone refuses to register normal volume.',
    guidance: 'Walk them through OS audio levels and hardware mute toggles.',
    incorrect: [
      'Advise shouting directly into the sound card.',
      'Suggest whispering motivational quotes louder.',
    ],
    empathyWin: 'Mic levels stabilize and pep talks resume.',
    empathyFail: 'They attempt semaphore signals for the robot swarm.',
  },
];

export const twists = [
  {
    id: 'micro-coffee',
    promptModifier: 'I also downsized my espresso cups for the aesthetic, which might be related.',
    empathyBoost: 'You remind them to hydrate and align their tiny energy with slow breaths.',
  },
  {
    id: 'shrinking-moon',
    promptModifier: 'Ever since the tiny moon screensaver launched, things feel smaller.',
    empathyBoost: 'You normalize how cosmic vibes can destabilize routines and suggest grounding rituals.',
  },
  {
    id: 'queue-pressure',
    promptModifier: 'I’m juggling three other tiny crises while we speak.',
    empathyBoost: 'You keep your tone calm and invite them to tackle one thing at a time.',
  },
  {
    id: 'meta-humor',
    promptModifier: 'Someone told me to call “the tiny helpdesk hero.” Are you really that small?',
    empathyBoost: 'You lean into the bit and reassure them that empathy scales infinitely.',
  },
];

export function buildCall({ persona, problem, twist }) {
  if (!persona || !problem) {
    return null;
  }

  const incorrectPool = Array.isArray(problem.incorrect) ? problem.incorrect.slice() : [];
  const incorrectOptions = incorrectPool.slice(0, 2).map((text, index) => ({
    id: `${problem.id}-incorrect-${index}`,
    text,
    correct: false,
  }));

  const options = [
    {
      id: `${problem.id}-correct`,
      text: problem.guidance,
      correct: true,
    },
    ...incorrectOptions,
  ];

  return {
    id: `${persona.id}_${problem.id}${twist ? `_${twist.id}` : ''}`,
    persona,
    problem,
    twist,
    prompt: `${persona.opener} ${problem.summary}`.trim(),
    options,
    empathyWin: twist?.empathyBoost
      ? `${problem.empathyWin} ${twist.empathyBoost}`
      : problem.empathyWin,
    empathyFail: persona.empathyFail,
  };
}

export function generateCallDeck({ seeds = [] } = {}) {
  const selected = seeds.length ? seeds : personas.map((persona, index) => ({
    persona,
    problem: problems[index % problems.length],
    twist: twists[index % twists.length],
  }));

  const calls = selected
    .map((assignment) => buildCall(assignment))
    .filter(Boolean);

  return calls;
}

export const placeholderCalls = generateCallDeck();
