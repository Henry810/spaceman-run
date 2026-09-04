/** Pixel color keys → RGBA — flat / high-contrast (404 silhouette feel) */
export const PALETTE: Record<string, string> = {
  '.': 'transparent',
  g: '#2f9a3a',
  G: '#143d1c',
  s: '#2f9a3a',
  b: '#121410',
  e: '#f0ead8',
  p: '#0c0c0a',
  y: '#d4a010',
  t: '#2f9a3a',
  a: '#28c090',
  A: '#0e6a4a',
  r: '#c86820',
  R: '#6a3010',
  c: '#3a88d0',
  C: '#184878',
  m: '#d040a8',
  M: '#781858',
  z: '#2a7030',
  Z: '#143818',
  x: '#0a1e10',
  w: '#ffffff',
  d: '#a84828',
  /** Museum stone */
  k: '#8a8678',
  K: '#4a483e',
  /** Cave rock */
  n: '#6a5a48',
  N: '#2e281e',
  /** Cloud outline (Chrome-style) */
  u: '#e8ecec',
};

export type PaletteRemap = Partial<Record<string, string>>;

export const OVERLAY_REMAPS: Record<string, PaletteRemap> = {
  gold_base: { g: '#e0b020', G: '#7a5808', s: '#e0b020', t: '#e0b020', y: '#e0b020' },
  night_base: { g: '#3a5a98', G: '#182848', s: '#3a5a98', t: '#3a5a98', y: '#3a5a98' },
  iron_base: { g: '#8890a0', G: '#404850', s: '#8890a0', t: '#8890a0', y: '#8890a0' },
  ember_base: { g: '#e04820', G: '#781808', s: '#e04820', t: '#e04820', y: '#e04820' },
  helix_base: { g: '#d038a8', G: '#580838', s: '#d038a8', t: '#d038a8', y: '#d038a8' },
  trail_base: { g: '#709828', G: '#384818', s: '#709828', t: '#709828', y: '#709828' },
  scar_base: { g: '#6a7a48', G: '#303820', s: '#6a7a48', t: '#6a7a48', y: '#6a7a48' },
};

export type PixelGrid = string[];

/** Chrome T-Rex 1x size. Drawn at scale 2. */
export const DINO_W = 44;
export const DINO_H = 47;
export const DINO_DUCK_W = 59;
/** Chrome ducks in the same 47-tall cell as standing; body sits on the bottom */
export const DINO_DUCK_H = 47;
/** ~2× Chrome size — shorter reaction window, room for costume detail */
export const SPRITE_SCALE = 2;

/** Chrome 44x47 standing/jump silhouette, colorized */
export const DINO_JUMP: PixelGrid = [
  '............................................',
  '............................................',
  '.............................ssssssssssssssy',
  '.............................sgggggggggggggy',
  '...........................ssggGGGGggggggggy',
  '...........................sggGeppesgggggggy',
  '...........................sggGessesgggggggy',
  '...........................sggGesGesgggggggy',
  '...........................sggGeppesgggggggy',
  '...........................sgggssssggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sggggggggggggggy.',
  '...........................sgggggggGGGGGGGG.',
  '.........................ssgggggggG.........',
  '.........................sggggggggG.........',
  '......................sssgggggggggG.........',
  '......................sgggggggggggG.........',
  '.......sgss........sssgggggggggggggssss.....',
  '.......sggG........sgggggggggggggggGGgG.....',
  '.......sgggss....ssgggsggggsggggggG..sG.....',
  '.......sgggsG....sgggsggggsggggsggG..sG.....',
  '.......sggsggssssgggsggggsggggsgggG.........',
  '.......sgsggggsggggsggggsggggsggggG.........',
  '.......sgggggsggggsggggsggggsgggggG.........',
  '.......sGgggsggggsggggsggggsggggggG.........',
  '.........sgsggggsggggsggggsggggsgGG.........',
  '.........sGggggsggggsggggsggggsgG...........',
  '...........sggsggggsggggsggggsggG...........',
  '...........sGsggggsggggsggggsggGG...........',
  '.............sgggsggggsggggsggG.............',
  '.............sGgsggggsggggsggGG.............',
  '...............sggggggggggggG...............',
  '...............sGggggggGGgggG...............',
  '.................Gttttt..Gttt...............',
  '.................Gtttbb..bbtt...............',
  '.................Gttt......Gt...............',
  '.................Gtbb......Gt...............',
  '.................Gt........Gt...............',
  '.................Gt........Gt...............',
  '.................Gttt......Gttt.............',
  '.................bbbb......bbbb.............',
  '............................................',
  '............................................',
];

/** Run frame A */
export const DINO_RUN_A: PixelGrid = [
  '............................................',
  '............................................',
  '.............................ssssssssssssssy',
  '.............................sgggggggggggggy',
  '...........................ssggGGGGggggggggy',
  '...........................sggGeppesgggggggy',
  '...........................sggGessesgggggggy',
  '...........................sggGesGesgggggggy',
  '...........................sggGeppesgggggggy',
  '...........................sgggssssggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sggggggggggggggy.',
  '...........................sgggggggGGGGGGGG.',
  '.........................ssgggggggG.........',
  '.........................sggggggggG.........',
  '......................sssgggggggggG.........',
  '......................sgggggggggggG.........',
  '.......sgss........sssgggggggggggggssss.....',
  '.......sggG........sgggggggggggggggGGgG.....',
  '.......sgggss....ssgggsggggsggggggG..sG.....',
  '.......sgggsG....sgggsggggsggggsggG..sG.....',
  '.......sggsggssssgggsggggsggggsgggG.........',
  '.......sgsggggsggggsggggsggggsggggG.........',
  '.......sgggggsggggsggggsggggsgggggG.........',
  '.......sGgggsggggsggggsggggsggggggG.........',
  '.........sgsggggsggggsggggsggggsgGG.........',
  '.........sGggggsggggsggggsggggsgG...........',
  '...........sggsggggsggggsggggsggG...........',
  '...........sGsggggsggggsggggsggGG...........',
  '.............sgggsggggsggggsggG.............',
  '.............sGgsggggsggggsggGG.............',
  '...............sgggggggggggg................',
  '...............s.gggggg..ggg................',
  '................tttt....tttt................',
  '................tttt....tttt................',
  '..............GGGG......GGGG................',
  '..............tttt......ttttt...............',
  '..............bbb.......tttttt..............',
  '..........................bbbb..............',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
];

/** Run frame B */
export const DINO_RUN_B: PixelGrid = [
  '............................................',
  '............................................',
  '.............................ssssssssssssssy',
  '.............................sgggggggggggggy',
  '...........................ssggGGGGggggggggy',
  '...........................sggGeppesgggggggy',
  '...........................sggGessesgggggggy',
  '...........................sggGesGesgggggggy',
  '...........................sggGeppesgggggggy',
  '...........................sgggssssggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sgggggggggggggggy',
  '...........................sggggggggggggggy.',
  '...........................sgggggggGGGGGGGG.',
  '.........................ssgggggggG.........',
  '.........................sggggggggG.........',
  '......................sssgggggggggG.........',
  '......................sgggggggggggG.........',
  '.......sgss........sssgggggggggggggssss.....',
  '.......sggG........sgggggggggggggggGGgG.....',
  '.......sgggss....ssgggsggggsggggggG..sG.....',
  '.......sgggsG....sgggsggggsggggsggG..sG.....',
  '.......sggsggssssgggsggggsggggsgggG.........',
  '.......sgsggggsggggsggggsggggsggggG.........',
  '.......sgggggsggggsggggsggggsgggggG.........',
  '.......sGgggsggggsggggsggggsggggggG.........',
  '.........sgsggggsggggsggggsggggsgGG.........',
  '.........sGggggsggggsggggsggggsgG...........',
  '...........sggsggggsggggsggggsggG...........',
  '...........sGsggggsggggsggggsggGG...........',
  '.............sgggsggggsggggsggG.............',
  '.............sGgsggggsggggsggGG.............',
  '...............sgggggggggggg................',
  '...............s.gggggg..ggg................',
  '................tttt....tttt................',
  '................tttt....tttt................',
  '................GGGGG.GGGG..................',
  '................tttttttttt..................',
  '..................ttbbbb....................',
  '..................bbbb......................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
];

/**
 * Duck — traced from local Google Dino 1× spritesheet
 * (offline-resources-1x, TREX+264 / TREX+323). Full 59×47 cell.
 */
export const DINO_DUCK: PixelGrid = [
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '..ss.......................................................',
  '..gg...................................ssssssssssssssss....',
  '..ggssss........sssssssssssssssss......gggggggggggggggg....',
  '..gggggg........ggggggggggggggggg....ssggGGggggggggggggss..',
  '..ggggggssssssssgggggggggggggggggssssggggepgggggggggggggg..',
  '..GGggggggggggggggggggggggggggggggggggggg..gggggggggggggg..',
  '....gggggggggggggggggggggggggggggggggggggssgggggggggggggg..',
  '....GGggggggggggggggggggggggggggggggggggggggggggggggggggg..',
  '......ggggggggggggggggggggggggggggggggggggggggggggggggggg..',
  '......GGggggggggggggggggggggggggggggggggggggggggggggggggg..',
  '........ggggggggggggggggggggggggggggggggggggggggggggggggg..',
  '........GGgggggggggggggggggggggggggggggggggggggGGGGGGGGGG..',
  '..........ggggggggggggggggggggggggggggggggggggg............',
  '..........GGgggggggggggggggggggggggGGGGgggggggg............',
  '............ggggggggggggggggggggggg....ggggggggssssss......',
  '............GGggggggggggggggggggggg....GGGGGGGGGGGGGG......',
  '..............ggggggggggggGGGGGggGG........................',
  '..............gGGGGggggggG.....gg..........................',
  '.............sg....gggggg......gg..........................',
  '.............gg....ggggGG......ggss........................',
  '.............ggss..gggg........GGGG........................',
  '.............GGGG..ggGG....................................',
  '...................gg......................................',
  '...................gg......................................',
  '...................ggss....................................',
  '...................GGGG....................................',
  '...........................................................',
  '...........................................................',
];

/** Duck B — official alternate leg frame (TREX+323) */
export const DINO_DUCK_B: PixelGrid = [
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '...........................................................',
  '..ss.......................................................',
  '..gg...................................ssssssssssssssss....',
  '..ggssss........sssssssssssssssss......gggggggggggggggg....',
  '..gggggg........ggggggggggggggggg....ssggGGggggggggggggss..',
  '..ggggggssssssssgggggggggggggggggssssggggepgggggggggggggg..',
  '..GGggggggggggggggggggggggggggggggggggggg..gggggggggggggg..',
  '....gggggggggggggggggggggggggggggggggggggssgggggggggggggg..',
  '....GGggggggggggggggggggggggggggggggggggggggggggggggggggg..',
  '......ggggggggggggggggggggggggggggggggggggggggggggggggggg..',
  '......GGggggggggggggggggggggggggggggggggggggggggggggggggg..',
  '........ggggggggggggggggggggggggggggggggggggggggggggggggg..',
  '........GGgggggggggggggggggggggggggggggggggggggGGGGGGGGGG..',
  '..........ggggggggggggggggggggggggggggggggggggg............',
  '..........GGgggggggggggggggggggggggGGGGgggggggg............',
  '............ggggggggggggggggggggggg....ggggggggssssss......',
  '............GGggggggggggggggggggggg....GGGGGGGGGGGGGG......',
  '..............ggggggggggggGGGGGggGG........................',
  '..............gggggGGGGggg.....gg..........................',
  '.............sggggg....gggss...gg..........................',
  '.............ggggGG....GGGGG...ggss........................',
  '.............gggg..............GGGG........................',
  '.............ggGG..........................................',
  '.............gg............................................',
  '.............gg............................................',
  '.............ggss..........................................',
  '.............GGGG..........................................',
  '...........................................................',
  '...........................................................',
];

/** Chrome 1× cloud outline 46×14 */
export const CLOUD: PixelGrid = [
  '.........................uuuu.................',
  '....................uuuuuu..uuu...............',
  '...................uu.........uu..............',
  '.................uuu...........u..............',
  '.................u.............uuuu...........',
  '.................u.............u..uuuuuu......',
  '..............uuuu............u........u......',
  '.............uu........................uuuu...',
  '......uuuuuuuu............................u...',
  '.....uu...................................uuu.',
  '.....u......................................u.',
  '.uu.uu...u...................................u',
  'uu........uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
  '..............................................',
];

/** Small cactus — Chrome 17×35, ~70% of tall cactus / dino */
export const CACTUS_S: PixelGrid = [
  '.......zzz.......',
  '......zZZZz......',
  '......zZZZx......',
  '......zZZZx......',
  '......zZZZx...z..',
  '......zZZZx..zZz.',
  '......zZZZx..zZx.',
  '......zZZZx..zZx.',
  '..z...zZZZx..zZx.',
  '.zZz..zZZZx..zZx.',
  '.zZx..zZZZx..zZx.',
  '.zZx..zZZZx..zZx.',
  '.zZx..zZZZx..zZx.',
  '.zZx..zZZZx..zZx.',
  '.zZx..zZZZx..zZx.',
  '.zZx..zZZZZzzZZx.',
  '.zZx..zZZZZZZZx..',
  '.zZx..zZZZZxxx...',
  '.zZx..zZZZx......',
  '.zZZzzZZZZx......',
  '..zZZZZZZZx......',
  '...zxxZZZZx......',
  '......zZZZx......',
  '......zZZZx......',
  '......zZZZx......',
  '......zZZZx......',
  '......zZZZx......',
  '......zZZZx......',
  '......xxxxx......',
];

/** Tall cactus — Chrome large is 50px vs dino 47px, top ~ dino head */
export const CACTUS_TALL: PixelGrid = [
  '..........zzzzz..........',
  '.........zZZZZZz.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx....zzz..',
  '.........zZZZZZx...zZZZz.',
  '..zzz....zZZZZZx...zZZZx.',
  '.zZZZz...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZx...zZZZZZx...zZZZx.',
  '.zZZZZzzzZZZZZZZzzzZZZx..',
  '.zZZZZZZZZZZZZZZZZZZZx...',
  '..zZZZZZZZZZZZZZZZZZx....',
  '...zZZZZZZZZZZZZxxxx.....',
  '....zxxxxZZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........zZZZZZx.........',
  '.........xxxxxxx.........',
];

export const PTERO_A: PixelGrid = [
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..........ssss................................',
  '..........gggg................................',
  '........ssgggg................................',
  '........gggggg................................',
  '......ssggggggss..............................',
  '......gggggggggg..............................',
  '....ssgggggggggg..............................',
  '....gggggggggggg..............................',
  '..ssggggggggggggssssssssssssss................',
  '..GGGGGGGGGGGGgggggggggggggggg................',
  '..............ggggggggggggggggss..............',
  '..............GGgggggggggggggggg..............',
  '................ggggggggggggggggsssssssssssy..',
  '................GGgggggggggggggggggssssssssy..',
  '..................gggggggggggggggggssy........',
  '..................gggggggggggggggggssy........',
  '..................ggggggggggggggggggggssss....',
  '..................ggggggggggggggggggGGGGGG....',
  '..................gggggggggggggggggg..........',
  '..................ggggggggGGGGGGGGGG..........',
  '..................gggggggg....................',
  '..................ggggggGG....................',
  '..................gggggg......................',
  '..................ggggGG......................',
  '..................gggg........................',
  '..................gggg........................',
  '..................gggg........................',
  '..................ggGG........................',
  '..................gg..........................',
  '..................GG..........................',
  '..............................................',
  '..............................................',
];

export const PTERO_B: PixelGrid = [
  '..............................................',
  '..............................................',
  '................ss............................',
  '................gg............................',
  '................ggss..........................',
  '................gggg..........................',
  '................ggggss........................',
  '................GGgggg........................',
  '..........ssss....ggggss......................',
  '..........gggg....gggggg......................',
  '........ssgggg....ggggggss....................',
  '........gggggg....gggggggg....................',
  '......ssggggggss..ggggggggss..................',
  '......gggggggggg..gggggggggg..................',
  '....ssgggggggggg..ggggggggggss................',
  '....gggggggggggg..gggggggggggg................',
  '..ssggggggggggggssgggggggggggg................',
  '..GGGGGGGGGGGGgggggggggggggggg................',
  '..............ggggggggggggggggss..............',
  '..............GGgggggggggggggggg..............',
  '................ggggggggggggggggsssssssssssy..',
  '................GGgggggggggggggggggssssssssy..',
  '..................gggggggggggggggggssy........',
  '..................GGgggggggggggggggssy........',
  '....................ggggggggggggggggggssss....',
  '....................GGggggggggggggggGGGGGG....',
  '......................gggggggggggggg..........',
  '......................GGGGGGGGGGGGGG..........',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
  '..............................................',
];

export const SCAR_MARKS: PixelGrid = [
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '................d...........................',
  '...............d.d..........................',
  '.................d..........................',
  '............................................',
  '..........d.................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
  '............................................',
];

function emptyGrid(): string[] {
  return Array.from({ length: DINO_H }, () => '.'.repeat(DINO_W));
}

function padPart(pixels: [number, number, string][]): PixelGrid {
  const rows = emptyGrid().map((r) => r.split(''));
  for (const [row, col, ch] of pixels) {
    if (row >= 0 && row < DINO_H && col >= 0 && col < DINO_W) {
      rows[row][col] = ch;
    }
  }
  return rows.map((r) => r.join(''));
}

/** Evolution accents sit on the Chrome standing/jump silhouette. */
export const SKIN_PARTS: Record<string, PixelGrid> = {
  agi_fins: padPart([[1, 30, 'a'], [1, 34, 'a'], [2, 28, 'a'], [2, 36, 'a'], [17, 6, 'a'], [18, 5, 'a']]),
  agi_legs: padPart([[38, 16, 'A'], [38, 26, 'A'], [40, 16, 'a'], [40, 26, 'a']]),
  agi_tail: padPart([[26, 8, 'a'], [27, 7, 'a'], [28, 9, 'A'], [29, 8, 'a']]),
  agi_stream: padPart([[18, 20, 'a'], [18, 21, 'a'], [24, 12, 'a'], [24, 13, 'a']]),
  agi_aura: padPart([[2, 26, 'a'], [2, 42, 'a'], [20, 8, 'a'], [32, 22, 'a']]),
  arm_plate: padPart([[22, 18, 'r'], [22, 19, 'R'], [22, 20, 'r'], [23, 17, 'R'], [23, 18, 'r'], [23, 19, 'R'], [23, 20, 'r'], [23, 21, 'R'], [24, 18, 'r'], [24, 19, 'R'], [24, 20, 'r']]),
  arm_bracer: padPart([[18, 8, 'r'], [19, 8, 'R'], [20, 8, 'r'], [18, 10, 'r'], [19, 10, 'R']]),
  arm_scale: padPart([[6, 32, 'r'], [10, 28, 'r'], [26, 14, 'r'], [28, 24, 'r']]),
  arm_helm: padPart([[2, 30, 'r'], [2, 31, 'R'], [2, 32, 'r'], [3, 29, 'R'], [3, 33, 'R']]),
  arm_shell: padPart([[21, 16, 'R'], [21, 17, 'R'], [21, 18, 'R'], [21, 19, 'R'], [22, 15, 'R'], [22, 20, 'R'], [25, 16, 'R'], [25, 20, 'R']]),
  per_eyes: padPart([[6, 31, 'c'], [6, 32, 'c'], [7, 31, 'c'], [7, 32, 'c']]),
  per_whisker: padPart([[8, 42, 'c'], [9, 43, 'c']]),
  per_crest: padPart([[1, 32, 'c'], [1, 34, 'c'], [0, 31, 'C'], [0, 35, 'C']]),
  per_glow: padPart([[5, 30, 'C'], [6, 29, 'c'], [6, 33, 'c']]),
  per_halo: padPart([[1, 28, 'c'], [1, 29, 'c'], [1, 30, 'c'], [1, 36, 'c'], [1, 37, 'c'], [1, 38, 'c']]),
  gene_mark1: padPart([[24, 18, 'm'], [25, 17, 'm'], [25, 19, 'm'], [26, 18, 'm']]),
  gene_mark2: padPart([[23, 17, 'm'], [23, 19, 'm'], [25, 16, 'm'], [25, 20, 'm'], [27, 17, 'm'], [27, 19, 'm']]),
  gene_mark3: padPart([[22, 16, 'm'], [22, 20, 'm'], [24, 15, 'M'], [24, 21, 'M'], [26, 16, 'm'], [26, 20, 'm']]),
  gene_mark4: padPart([[8, 32, 'M'], [8, 36, 'm'], [21, 16, 'm'], [21, 20, 'M'], [23, 18, 'm'], [27, 17, 'M'], [27, 19, 'm']]),
  agi_spark: padPart([[3, 27, 'a'], [3, 41, 'a'], [16, 10, 'a'], [30, 18, 'a'], [34, 24, 'a']]),
  arm_spike: padPart([[20, 15, 'R'], [20, 21, 'R'], [19, 18, 'r'], [26, 17, 'R'], [26, 19, 'R']]),
  per_orbit: padPart([[0, 29, 'c'], [0, 33, 'c'], [0, 37, 'c'], [4, 27, 'C'], [4, 39, 'C']]),
  gene_mark5: padPart([[7, 30, 'm'], [9, 34, 'M'], [22, 15, 'm'], [24, 19, 'M'], [28, 16, 'm'], [28, 20, 'M']]),
  gene_mark6: padPart([[2, 31, 'M'], [2, 35, 'm'], [8, 29, 'm'], [8, 37, 'M'], [22, 14, 'M'], [26, 18, 'm'], [30, 16, 'M'], [30, 20, 'm']]),
};

function padDuckPart(pixels: [number, number, string][]): PixelGrid {
  const rows = Array.from({ length: DINO_DUCK_H }, () =>
    Array.from({ length: DINO_DUCK_W }, () => '.'),
  );
  for (const [row, col, ch] of pixels) {
    if (row >= 0 && row < DINO_DUCK_H && col >= 0 && col < DINO_DUCK_W) {
      rows[row][col] = ch;
    }
  }
  return rows.map((r) => r.join(''));
}

/**
 * Evolution accents remapped onto the official 59×47 duck cell
 * (body ~rows 20–40). Standing parts are 44-wide and would misalign.
 */
export const SKIN_PARTS_DUCK: Record<string, PixelGrid> = {
  agi_fins: padDuckPart([
    [20, 8, 'a'],
    [20, 12, 'a'],
    [21, 6, 'a'],
    [21, 48, 'a'],
  ]),
  agi_legs: padDuckPart([
    [40, 14, 'A'],
    [40, 28, 'A'],
    [42, 14, 'a'],
    [42, 28, 'a'],
  ]),
  agi_tail: padDuckPart([
    [28, 3, 'a'],
    [29, 2, 'A'],
    [30, 4, 'a'],
  ]),
  agi_stream: padDuckPart([
    [26, 18, 'a'],
    [26, 19, 'a'],
    [30, 10, 'a'],
    [30, 11, 'a'],
  ]),
  agi_aura: padDuckPart([
    [20, 20, 'a'],
    [20, 40, 'a'],
    [32, 8, 'a'],
    [24, 50, 'a'],
  ]),
  agi_spark: padDuckPart([
    [21, 16, 'a'],
    [21, 44, 'a'],
    [28, 12, 'a'],
    [34, 22, 'a'],
  ]),
  arm_plate: padDuckPart([
    [27, 22, 'r'],
    [27, 23, 'R'],
    [27, 24, 'r'],
    [28, 21, 'R'],
    [28, 22, 'r'],
    [28, 23, 'R'],
    [28, 24, 'r'],
    [28, 25, 'R'],
    [29, 22, 'r'],
    [29, 23, 'R'],
    [29, 24, 'r'],
  ]),
  arm_bracer: padDuckPart([
    [30, 8, 'r'],
    [31, 8, 'R'],
    [32, 8, 'r'],
    [30, 10, 'r'],
    [31, 10, 'R'],
  ]),
  arm_scale: padDuckPart([
    [24, 30, 'r'],
    [28, 16, 'r'],
    [30, 26, 'r'],
    [32, 20, 'r'],
  ]),
  arm_helm: padDuckPart([
    [21, 44, 'r'],
    [21, 45, 'R'],
    [21, 46, 'r'],
    [22, 43, 'R'],
    [22, 47, 'R'],
  ]),
  arm_shell: padDuckPart([
    [26, 20, 'R'],
    [26, 21, 'R'],
    [26, 22, 'R'],
    [26, 23, 'R'],
    [27, 19, 'R'],
    [27, 24, 'R'],
    [30, 20, 'R'],
    [30, 24, 'R'],
  ]),
  arm_spike: padDuckPart([
    [25, 18, 'R'],
    [25, 26, 'R'],
    [24, 22, 'r'],
    [31, 21, 'R'],
    [31, 23, 'R'],
  ]),
  per_eyes: padDuckPart([
    [22, 45, 'c'],
    [22, 46, 'c'],
    [23, 45, 'c'],
    [23, 46, 'c'],
  ]),
  per_whisker: padDuckPart([
    [24, 50, 'c'],
    [25, 51, 'c'],
  ]),
  per_crest: padDuckPart([
    [19, 42, 'c'],
    [19, 44, 'c'],
    [18, 41, 'C'],
    [18, 45, 'C'],
  ]),
  per_glow: padDuckPart([
    [21, 43, 'C'],
    [22, 42, 'c'],
    [22, 47, 'c'],
  ]),
  per_halo: padDuckPart([
    [19, 40, 'c'],
    [19, 41, 'c'],
    [19, 46, 'c'],
    [19, 47, 'c'],
  ]),
  per_orbit: padDuckPart([
    [18, 39, 'c'],
    [18, 43, 'c'],
    [18, 48, 'c'],
    [22, 38, 'C'],
    [22, 50, 'C'],
  ]),
  gene_mark1: padDuckPart([
    [28, 22, 'm'],
    [29, 21, 'm'],
    [29, 23, 'm'],
    [30, 22, 'm'],
  ]),
  gene_mark2: padDuckPart([
    [27, 21, 'm'],
    [27, 23, 'm'],
    [29, 20, 'm'],
    [29, 24, 'm'],
    [31, 21, 'm'],
    [31, 23, 'm'],
  ]),
  gene_mark3: padDuckPart([
    [26, 20, 'm'],
    [26, 24, 'm'],
    [28, 19, 'M'],
    [28, 25, 'M'],
    [30, 20, 'm'],
    [30, 24, 'm'],
  ]),
  gene_mark4: padDuckPart([
    [24, 36, 'M'],
    [24, 40, 'm'],
    [27, 20, 'm'],
    [27, 24, 'M'],
    [29, 22, 'm'],
    [32, 21, 'M'],
    [32, 23, 'm'],
  ]),
  gene_mark5: padDuckPart([
    [23, 34, 'm'],
    [25, 38, 'M'],
    [27, 19, 'm'],
    [29, 23, 'M'],
    [32, 20, 'm'],
    [32, 24, 'M'],
  ]),
  gene_mark6: padDuckPart([
    [21, 42, 'M'],
    [21, 46, 'm'],
    [24, 33, 'm'],
    [24, 41, 'M'],
    [27, 18, 'M'],
    [30, 22, 'm'],
    [33, 20, 'M'],
    [33, 24, 'm'],
  ]),
};

export const SCAR_MARKS_DUCK: PixelGrid = padDuckPart([
  [27, 18, 'd'],
  [28, 17, 'd'],
  [28, 19, 'd'],
  [29, 18, 'd'],
  [32, 12, 'd'],
]);


function stamp(canvas: string[][], sprite: PixelGrid, ox: number, oy: number): void {
  for (let r = 0; r < sprite.length; r++) {
    for (let c = 0; c < sprite[r].length; c++) {
      const ch = sprite[r][c];
      if (ch === '.') continue;
      const rr = oy + r;
      const cc = ox + c;
      if (rr >= 0 && rr < canvas.length && cc >= 0 && cc < canvas[0].length) {
        canvas[rr][cc] = ch;
      }
    }
  }
}

export function makeCactusCluster(count: 2 | 3 | 4): PixelGrid {
  const gap = 0;
  const unitW = CACTUS_S[0].length;
  const h = CACTUS_S.length;
  const w = count * unitW + (count - 1) * gap;
  const canvas = Array.from({ length: h }, () => Array.from({ length: w }, () => '.'));
  for (let i = 0; i < count; i++) stamp(canvas, CACTUS_S, i * (unitW + gap), 0);
  return canvas.map((row) => row.join(''));
}

export const CACTUS_X2 = makeCactusCluster(2);
export const CACTUS_X3 = makeCactusCluster(3);
export const CACTUS_X4 = makeCactusCluster(4);

/**
 * Museum gate / cave arch — tall enough that standing & ducking pass the
 * opening, but jumping hits the lintel. Built at 48×64 (128px @ scale 2).
 */
const GATE_W = 48;
/** Tall enough that a full jump still clips the lintel (can't vault over). */
const GATE_H = 84;
/** Top beam thickness in grid rows — keep in sync with obstacleHitboxes */
export const GATE_LINTEL_ROWS = 10;

function makeMuseumGate(): PixelGrid {
  const rows: string[] = [];
  for (let r = 0; r < GATE_H; r++) {
    const line = Array.from({ length: GATE_W }, () => '.');
    const set = (c: number, ch: string) => {
      if (c >= 0 && c < GATE_W) line[c] = ch;
    };
    // Outer frame columns
    set(0, 'K');
    set(1, 'k');
    set(GATE_W - 2, 'k');
    set(GATE_W - 1, 'K');
    if (r < GATE_LINTEL_ROWS || r >= GATE_H - 2) {
      for (let c = 0; c < GATE_W; c++) set(c, r === 0 || r === GATE_H - 1 ? 'K' : 'k');
    } else {
      // Inner pillars
      set(2, 'K');
      set(3, 'k');
      set(GATE_W - 4, 'k');
      set(GATE_W - 3, 'K');
    }
    // Doorstep
    if (r === GATE_H - 3) {
      for (let c = 2; c < GATE_W - 2; c++) if (line[c] === '.') set(c, 'k');
    }
    rows.push(line.join(''));
  }
  return rows;
}

function makeCaveArch(): PixelGrid {
  const rows: string[] = [];
  const mid = (GATE_W - 1) / 2;
  for (let r = 0; r < GATE_H; r++) {
    const line = Array.from({ length: GATE_W }, () => '.');
    const set = (c: number, ch: string) => {
      if (c >= 0 && c < GATE_W) line[c] = ch;
    };
    // Opening starts below lintel; arch curves in the lintel band
    if (r < GATE_LINTEL_ROWS) {
      const t = r / GATE_LINTEL_ROWS;
      // Half-width of hole grows with r (0 at top → wide at lintel bottom)
      const hole = Math.floor(4 + t * 14);
      for (let c = 0; c < GATE_W; c++) {
        if (Math.abs(c - mid) >= hole) set(c, r < 2 ? 'N' : 'n');
      }
      // Cap stone row
      if (r < 2) for (let c = 0; c < GATE_W; c++) set(c, 'N');
    } else {
      // Side pillars only — center open for stand/duck
      set(0, 'N');
      set(1, 'n');
      set(2, 'n');
      set(GATE_W - 3, 'n');
      set(GATE_W - 2, 'n');
      set(GATE_W - 1, 'N');
      if (r > GATE_H - 4) {
        set(3, 'n');
        set(GATE_W - 4, 'n');
      }
    }
    rows.push(line.join(''));
  }
  return rows;
}

export const MUSEUM_GATE: PixelGrid = makeMuseumGate();
export const CAVE_ARCH: PixelGrid = makeCaveArch();

/** Last row that contains a painted pixel (feet / cactus base). */
export function lastSolidRow(grid: PixelGrid): number {
  for (let i = grid.length - 1; i >= 0; i--) {
    if (/[^.]/.test(grid[i])) return i;
  }
  return grid.length - 1;
}

export function gridBounds(grid: PixelGrid): { x: number; y: number; w: number; h: number } {
  let minX = grid[0].length;
  let minY = grid.length;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '.') continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX) return { x: 0, y: 0, w: grid[0].length, h: grid.length };
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/** Canvas Y so the last solid row sits on `groundY`. */
export function plantY(groundY: number, grid: PixelGrid, scale: number): number {
  return groundY - (lastSolidRow(grid) + 1) * scale;
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  grid: PixelGrid,
  x: number,
  y: number,
  scale: number,
  alpha = 1,
  remap?: PaletteRemap,
): void {
  const prev = ctx.globalAlpha;
  ctx.globalAlpha = alpha;
  for (let row = 0; row < grid.length; row++) {
    const line = grid[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (ch === '.') continue;
      const color = remap?.[ch] ?? PALETTE[ch];
      if (!color || color === 'transparent') continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
    }
  }
  ctx.globalAlpha = prev;
}

export function gridSize(grid: PixelGrid): { w: number; h: number } {
  return { w: grid[0]?.length ?? 0, h: grid.length };
}
