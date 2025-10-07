/**
 * Modular call content pools used to assemble dynamic scenarios.
 * Expanded for jam-ready breadth (≥ 30 unique combinations).
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
  {
    id: 'puzzle-streamer',
    name: 'Lia, the Puzzle Streamer',
    mood: 'calmly frantic',
    opener: 'Chat keeps yelling that my puzzle overlay is looping tiny clues forever.',
    empathyWin: 'Lia thanks you live on stream and chat erupts in wholesome emotes.',
    empathyFail: 'She promises a manual solve and chat revolts with snail spam.',
  },
  {
    id: 'remote-thereminist',
    name: 'Iggy, the Remote Thereminist',
    mood: 'ethereal but earnest',
    opener: 'My theremin app outputs chipmunk squeaks. My recital is in ten tiny minutes.',
    empathyWin: 'Iggy’s theremin hums smoothly and he dedicates the first piece to you.',
    empathyFail: 'He resorts to interpretive humming and the recital host looks baffled.',
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
  {
    id: 'cloud-sync',
    summary: 'Files are stuck in an endless sync spinner.',
    guidance: 'Help them reauthenticate the account and confirm the sync folder path.',
    incorrect: [
      'Propose rebooting the whole cloud by unplugging the router for an hour.',
      'Encourage emailing every file to themselves instead.',
    ],
    empathyWin: 'Sync resumes and the progress bar gently glows.',
    empathyFail: 'They start printing everything “just in case.”',
  },
  {
    id: 'printer-jam',
    summary: 'Mini-printer insists there is a jam with no paper inside.',
    guidance: 'Run the maintenance cycle and reseat the micro-cartridge.',
    incorrect: [
      'Recommend shaking the printer like a snow globe.',
      'Suggest feeding it regular paper to “teach scale.”',
    ],
    empathyWin: 'The printer chirps happily and spits out perfect stickers.',
    empathyFail: 'It starts chanting error beeps in Morse code.',
  },
  {
    id: 'calendar-loop',
    summary: 'Calendar keeps duplicating the same meeting every five minutes.',
    guidance: 'Clear cached invites and reset the miniature timezone preference.',
    incorrect: [
      'Tell them to attend every copy just in case.',
      'Advise smashing the “accept” button until it stops.',
    ],
    empathyWin: 'Schedule normalizes and they reclaim their afternoon.',
    empathyFail: 'They create a panic spreadsheet titled “Infinite Meetings.”',
  },
  {
    id: 'emoji-overload',
    summary: 'Chat app replaces all text with random emojis.',
    guidance: 'Toggle accessibility text mode and clear the custom emoji cache.',
    incorrect: [
      'Encourage responding using only interpretive dance gifs.',
      'Suggest leaning into chaos and communicating with fruit icons.',
    ],
    empathyWin: 'Messages return to readable words with tasteful emoji accents.',
    empathyFail: 'They submit an empathy report entirely in broccoli icons.',
  },
  {
    id: 'tiny-keyboard',
    summary: 'New miniature keyboard keeps triggering macros.',
    guidance: 'Guide them through remapping the macro layer and adjusting sensitivity.',
    incorrect: [
      'Recommend typing exclusively with tweezers.',
      'Tell them to glue the troublesome keys down.',
    ],
    empathyWin: 'Their fingers find a rhythm and muscle memory returns.',
    empathyFail: 'They shop for a novelty keytar instead.',
  },
  {
    id: 'drone-handoff',
    summary: 'Office delivery drone refuses to drop the snacks.',
    guidance: 'Recalibrate the proximity sensor and reset the drop-off zone.',
    incorrect: [
      'Suggest luring it with interpretive jazz hands.',
      'Instruct them to shout the password louder until it relents.',
    ],
    empathyWin: 'Snacks descend like tiny heroes and the drone salutes.',
    empathyFail: 'It circles forever humming an ominous tune.',
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
  {
    id: 'tiny-desk-buddy',
    promptModifier: 'My desk buddy keeps pressing random buttons trying to help.',
    empathyBoost: 'You loop them in with a friendly task list so everyone feels useful.',
  },
  {
    id: 'alternate-shift',
    promptModifier: 'I swapped shifts with someone in a different microuniverse and nothing matches.',
    empathyBoost: 'You sync their expectations and promise a post-shift micro-high five.',
  },
  {
    id: 'time-zone-lag',
    promptModifier: 'My schedule thinks it’s three Tuesdays from now.',
    empathyBoost: 'You breathe with them and realign their calendar to the current timeline.',
  },
  {
    id: 'office-ghost',
    promptModifier: 'A tiny office ghost keeps toggling settings when I look away.',
    empathyBoost: 'You suggest a respectful tech séance and promise to stay on the line.',
  },
];

export const defaultCallSeeds = [
  { persona: 'overwhelmed-designer', problem: 'display-scaling', twist: 'queue-pressure' },
  { persona: 'overwhelmed-designer', problem: 'cloud-sync', twist: 'micro-coffee' },
  { persona: 'overwhelmed-designer', problem: 'printer-jam', twist: 'tiny-desk-buddy' },
  { persona: 'overwhelmed-designer', problem: 'calendar-loop', twist: 'time-zone-lag' },
  { persona: 'overwhelmed-designer', problem: 'emoji-overload', twist: 'meta-humor' },
  { persona: 'sleep-deprived-gamer', problem: 'usb-orientation', twist: 'queue-pressure' },
  { persona: 'sleep-deprived-gamer', problem: 'tiny-keyboard', twist: 'shrinking-moon' },
  { persona: 'sleep-deprived-gamer', problem: 'gif-refresh', twist: 'meta-humor' },
  { persona: 'sleep-deprived-gamer', problem: 'cloud-sync', twist: 'alternate-shift' },
  { persona: 'sleep-deprived-gamer', problem: 'drone-handoff', twist: 'office-ghost' },
  { persona: 'mascot-coordinator', problem: 'gif-refresh', twist: 'tiny-desk-buddy' },
  { persona: 'mascot-coordinator', problem: 'printer-jam', twist: 'queue-pressure' },
  { persona: 'mascot-coordinator', problem: 'calendar-loop', twist: 'alternate-shift' },
  { persona: 'mascot-coordinator', problem: 'emoji-overload', twist: 'micro-coffee' },
  { persona: 'mascot-coordinator', problem: 'cloud-sync', twist: 'time-zone-lag' },
  { persona: 'miniature-roboticist', problem: 'mic-volume', twist: 'queue-pressure' },
  { persona: 'miniature-roboticist', problem: 'drone-handoff', twist: 'tiny-desk-buddy' },
  { persona: 'miniature-roboticist', problem: 'cloud-sync', twist: 'time-zone-lag' },
  { persona: 'miniature-roboticist', problem: 'usb-orientation', twist: 'alternate-shift' },
  { persona: 'miniature-roboticist', problem: 'emoji-overload', twist: 'office-ghost' },
  { persona: 'puzzle-streamer', problem: 'calendar-loop', twist: 'shrinking-moon' },
  { persona: 'puzzle-streamer', problem: 'tiny-keyboard', twist: 'micro-coffee' },
  { persona: 'puzzle-streamer', problem: 'display-scaling', twist: 'alternate-shift' },
  { persona: 'puzzle-streamer', problem: 'cloud-sync', twist: 'meta-humor' },
  { persona: 'puzzle-streamer', problem: 'gif-refresh', twist: 'tiny-desk-buddy' },
  { persona: 'remote-thereminist', problem: 'mic-volume', twist: 'time-zone-lag' },
  { persona: 'remote-thereminist', problem: 'printer-jam', twist: 'office-ghost' },
  { persona: 'remote-thereminist', problem: 'drone-handoff', twist: 'queue-pressure' },
  { persona: 'remote-thereminist', problem: 'tiny-keyboard', twist: 'micro-coffee' },
  { persona: 'remote-thereminist', problem: 'calendar-loop', twist: 'alternate-shift' },
];

const personaMap = new Map(personas.map((persona) => [persona.id, persona]));
const problemMap = new Map(problems.map((problem) => [problem.id, problem]));
const twistMap = new Map(twists.map((twist) => [twist.id, twist]));

function resolveEntity(ref, map) {
  if (!ref) {
    return null;
  }
  if (typeof ref === 'string') {
    return map.get(ref) ?? null;
  }
  return ref;
}

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

  const twistClone = twist && typeof twist === 'object' ? { ...twist } : null;
  let empathyBoostText = null;
  if (twistClone) {
    if (typeof twistClone.empathyBoost === 'string') {
      const trimmed = twistClone.empathyBoost.trim();
      if (trimmed) {
        empathyBoostText = trimmed;
        twistClone.empathyBoost = trimmed;
      } else {
        console.warn(
          `[content] Twist "${twistClone.id ?? 'unknown'}" empathyBoost is empty; ignoring value.`,
        );
        delete twistClone.empathyBoost;
      }
    } else if (Object.prototype.hasOwnProperty.call(twistClone, 'empathyBoost')) {
      console.warn(
        `[content] Twist "${twistClone.id ?? 'unknown'}" empathyBoost must be a string; ignoring value.`,
      );
      delete twistClone.empathyBoost;
    }
  }

  return {
    id: `${persona.id}_${problem.id}${twistClone ? `_${twistClone.id}` : ''}`,
    persona,
    problem,
    twist: twistClone,
    prompt: `${persona.opener} ${problem.summary}`.trim(),
    options,
    empathyWin: empathyBoostText
      ? `${problem.empathyWin} ${empathyBoostText}`
      : problem.empathyWin,
    empathyFail: persona.empathyFail,
  };
}

export function generateCallDeck({ seeds = defaultCallSeeds } = {}) {
  const assignments = Array.isArray(seeds) && seeds.length ? seeds : defaultCallSeeds;

  const calls = assignments
    .map((assignment) => {
      if (!assignment || typeof assignment !== 'object') {
        return null;
      }
      const persona = resolveEntity(assignment.persona, personaMap);
      const problem = resolveEntity(assignment.problem, problemMap);
      const twist = assignment.twist === null || assignment.twist === undefined
        ? null
        : resolveEntity(assignment.twist, twistMap);
      return buildCall({ persona, problem, twist });
    })
    .filter(Boolean);

  return calls;
}

export const placeholderCalls = generateCallDeck();
