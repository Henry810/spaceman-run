/** Pixel color keys → RGBA */
export const PALETTE: Record<string, string> = {
  '.': 'transparent',
  g: '#5ecf6a',
  G: '#2f8f44',
  s: '#a8e89a',
  b: '#1c3a24',
  e: '#f7f4e8',
  p: '#1a1814',
  y: '#e0b44a',
  t: '#3d9a52',
  a: '#5ef0c0',
  A: '#1a9a72',
  r: '#e09048',
  R: '#9a5020',
  c: '#58b4f0',
  C: '#206898',
  m: '#f078c0',
  M: '#a03870',
  z: '#3aa34a',
  Z: '#2a7a36',
  x: '#1a4a24',
  w: '#ffffff',
  d: '#c45a3a',
};

export type PaletteRemap = Partial<Record<string, string>>;

export const OVERLAY_REMAPS: Record<string, PaletteRemap> = {
  gold_base: { g: '#f0d24a', G: '#c49818', s: '#fff0a0', t: '#b88820', y: '#ffe060' },
  night_base: { g: '#4a6eb8', G: '#243868', s: '#8aacf0', t: '#1a2850', y: '#a0b8e8' },
  iron_base: { g: '#a8b0bc', G: '#5a646e', s: '#d8dee8', t: '#484e56', y: '#c0c8d0' },
  ember_base: { g: '#f06038', G: '#a02818', s: '#ff9870', t: '#781810', y: '#ffb060' },
  helix_base: { g: '#e050c0', G: '#781858', s: '#f8a0e0', t: '#580840', y: '#f0c0e8' },
  trail_base: { g: '#88b848', G: '#486820', s: '#c8e878', t: '#304818', y: '#d0e060' },
  scar_base: { g: '#8a9a6a', G: '#4a5a38', s: '#c0c8a0', t: '#3a4830', y: '#b8a878' },
};

export type PixelGrid = string[];

/** Chrome T-Rex 1x size. Drawn at scale 2. */
export const DINO_W = 44;
export const DINO_H = 47;
export const DINO_DUCK_W = 59;
export const DINO_DUCK_H = 25;
export const SPRITE_SCALE = 1;

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

/** Duck — Chrome 59×25: flat body, head forward, short rear, low profile */
export const DINO_DUCK: PixelGrid = [
  '.............................................sssssssssssssy',
  '.............................................sggggggggggggy',
  '.............................................sgbebpgggggggy',
  '.............................................sggggggggggggy',
  '.............................................sgggggggggggy.',
  '...............................sssssssssssssssggggggGGGGGGG',
  '....sssssssssssssssssssssssssssggggggggggggggggggggG.......',
  '...sgggggggggggggggggggggggggggggggggggggggggggggGG........',
  '..sgggggggggggggggggggggggggggggggggggggggggggggG..........',
  '.sggggggggggggggggggggggggggggggggggggggggggggGG...........',
  'sggggggggggggggggggggggggggggggggggggggggggggG.............',
  'sGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG..............',
  '.....ttttt................ttttt............................',
  '.....tttbb................GGttt............................',
  '.....bbbb.................bbbb.............................',
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
];

export const DINO_DUCK_B: PixelGrid = [
  '.............................................sssssssssssssy',
  '.............................................sggggggggggggy',
  '.............................................sgbebpgggggggy',
  '.............................................sggggggggggggy',
  '.............................................sgggggggggggy.',
  '...............................sssssssssssssssggggggGGGGGGG',
  '....sssssssssssssssssssssssssssggggggggggggggggggggG.......',
  '...sgggggggggggggggggggggggggggggggggggggggggggggGG........',
  '..sgggggggggggggggggggggggggggggggggggggggggggggG..........',
  '.sggggggggggggggggggggggggggggggggggggggggggggGG...........',
  'sggggggggggggggggggggggggggggggggggggggggggggG.............',
  'sGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG..............',
  '...............ttttt.................ttttt.................',
  '...............tttbb.................GGttt.................',
  '...............bbbb..................bbbb..................',
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

/** Evolution accents sit on the Chrome silhouette. */
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
