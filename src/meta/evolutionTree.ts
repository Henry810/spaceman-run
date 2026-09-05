export type BranchId = 'agi' | 'arm' | 'per' | 'gene' | 'apex';

/** Score-meter units shown on HUD (world.distance / 10). */
export const APEX_CORE_REQUIRES = ['agi_6', 'arm_6', 'per_6', 'gene_6'] as const;

export interface NodeEffects {
  jumpWindupMul?: number;
  duckWindupMul?: number;
  jumpForceMul?: number;
  doubleJump?: boolean;
  airDrift?: number;
  shieldCharges?: number;
  iframeMs?: number;
  hitboxShrink?: number;
  landRecoveryMul?: number;
  nightVision?: boolean;
  obstaclePreview?: boolean;
  startDashMs?: number;
  dnaMultiplier?: number;
  dnaBonus?: number;
  /** Open-run warp to this HUD score (meters). */
  startWarpMeters?: number;
  /** After death, warp this many HUD meters then still game-over. */
  deathWarpMeters?: number;
  /** Seconds between auto projectiles that destroy the first obstacle ahead. */
  boltIntervalSec?: number;
  /** Jump↔duck can interrupt each other (incl. mid-air duck cancel). */
  flexCancel?: boolean;
}

export interface EvolutionNode {
  id: string;
  branch: BranchId;
  name: string;
  description: string;
  cost: number;
  requires: string[];
  effects: NodeEffects;
  /** Skin part key applied when unlocked */
  skinPart: string;
  /** Layout position in tree UI (0-1 normalized within branch column) */
  order: number;
}

export const BRANCH_META: Record<
  BranchId,
  { name: string; color: string; accent: string }
> = {
  agi: { name: '迅捷', color: '#3dba8c', accent: '#7dffc4' },
  arm: { name: '鳞甲', color: '#c47a3a', accent: '#ffb06b' },
  per: { name: '探照', color: '#4a8fd4', accent: '#8ec8ff' },
  gene: { name: '共生', color: '#c45a8c', accent: '#ff9ec8' },
  apex: { name: '典藏', color: '#d4a017', accent: '#ffe066' },
};

export const EVOLUTION_NODES: EvolutionNode[] = [
  // Agility
  {
    id: 'agi_1',
    branch: 'agi',
    name: '迅捷肌腱',
    description: '起跳与下蹲前摇缩短 35%',
    cost: 40,
    requires: [],
    effects: { jumpWindupMul: 0.65, duckWindupMul: 0.65 },
    skinPart: 'agi_fins',
    order: 0,
  },
  {
    id: 'agi_2',
    branch: 'agi',
    name: '弹射踝',
    description: '前摇再缩短，跳跃高度 +12%',
    cost: 90,
    requires: ['agi_1'],
    effects: { jumpWindupMul: 0.4, duckWindupMul: 0.4, jumpForceMul: 1.12 },
    skinPart: 'agi_legs',
    order: 1,
  },
  {
    id: 'agi_3',
    branch: 'agi',
    name: '双段跃',
    description: '空中可再跳一次',
    cost: 160,
    requires: ['agi_2'],
    effects: { doubleJump: true },
    skinPart: 'agi_tail',
    order: 2,
  },
  {
    id: 'agi_4',
    branch: 'agi',
    name: '气流微调',
    description: '空中可用 ←→ 微移',
    cost: 220,
    requires: ['agi_3'],
    effects: { airDrift: 55 },
    skinPart: 'agi_stream',
    order: 3,
  },
  {
    id: 'agi_5',
    branch: 'agi',
    name: '瞬动身法',
    description: '前摇近瞬发',
    cost: 320,
    requires: ['agi_4'],
    effects: {
      jumpWindupMul: 0.15,
      duckWindupMul: 0.15,
    },
    skinPart: 'agi_aura',
    order: 4,
  },
  {
    id: 'agi_6',
    branch: 'agi',
    name: '真空步',
    description: '空中微调加强；基因获取 +10%',
    cost: 430,
    requires: ['agi_5'],
    effects: { airDrift: 90, dnaBonus: 0.1 },
    skinPart: 'agi_spark',
    order: 5,
  },

  // Armor
  {
    id: 'arm_1',
    branch: 'arm',
    name: '角质鳞盾',
    description: '每局一次碰撞护盾',
    cost: 50,
    requires: [],
    effects: { shieldCharges: 1 },
    skinPart: 'arm_plate',
    order: 0,
  },
  {
    id: 'arm_2',
    branch: 'arm',
    name: '棘鳞甲',
    description: '护盾触发后短暂无敌',
    cost: 100,
    requires: ['arm_1'],
    effects: { iframeMs: 900 },
    skinPart: 'arm_bracer',
    order: 1,
  },
  {
    id: 'arm_3',
    branch: 'arm',
    name: '擦边鳞',
    description: '碰撞盒略微缩小',
    cost: 170,
    requires: ['arm_2'],
    effects: { hitboxShrink: 3 },
    skinPart: 'arm_scale',
    order: 2,
  },
  {
    id: 'arm_4',
    branch: 'arm',
    name: '稳落姿',
    description: '落地硬直缩短 50%',
    cost: 230,
    requires: ['arm_3'],
    effects: { landRecoveryMul: 0.5 },
    skinPart: 'arm_helm',
    order: 3,
  },
  {
    id: 'arm_5',
    branch: 'arm',
    name: '再生甲壳',
    description: '护盾可充能第二次',
    cost: 340,
    requires: ['arm_4'],
    effects: { shieldCharges: 2 },
    skinPart: 'arm_shell',
    order: 4,
  },
  {
    id: 'arm_6',
    branch: 'arm',
    name: '三重甲',
    description: '护盾第三次；无敌更长；基因 +10%',
    cost: 460,
    requires: ['arm_5'],
    effects: { shieldCharges: 3, iframeMs: 1200, dnaBonus: 0.1 },
    skinPart: 'arm_spike',
    order: 5,
  },

  // Perception
  {
    id: 'per_1',
    branch: 'per',
    name: '夜瞳',
    description: '夜间场景更清晰',
    cost: 45,
    requires: [],
    effects: { nightVision: true },
    skinPart: 'per_eyes',
    order: 0,
  },
  {
    id: 'per_2',
    branch: 'per',
    name: '预兆轮廓',
    description: '即将出现的障碍显示虚影',
    cost: 95,
    requires: ['per_1'],
    effects: { obstaclePreview: true },
    skinPart: 'per_whisker',
    order: 1,
  },
  {
    id: 'per_3',
    branch: 'per',
    name: '基因冲刺',
    description: '开局短距加速冲刺',
    cost: 150,
    requires: ['per_2'],
    effects: { startDashMs: 1800 },
    skinPart: 'per_crest',
    order: 2,
  },
  {
    id: 'per_4',
    branch: 'per',
    name: '深夜视',
    description: '夜间对比度进一步提升',
    cost: 210,
    requires: ['per_3'],
    effects: { nightVision: true },
    skinPart: 'per_glow',
    order: 3,
  },
  {
    id: 'per_5',
    branch: 'per',
    name: '全知预感',
    description: '预警更远',
    cost: 300,
    requires: ['per_4'],
    effects: { obstaclePreview: true },
    skinPart: 'per_halo',
    order: 4,
  },
  {
    id: 'per_6',
    branch: 'per',
    name: '远见冲刺',
    description: '开局冲刺加长；基因 +10%',
    cost: 410,
    requires: ['per_5'],
    effects: { startDashMs: 2600, dnaBonus: 0.1 },
    skinPart: 'per_orbit',
    order: 5,
  },

  // Gene economy
  {
    id: 'gene_1',
    branch: 'gene',
    name: '孵化 I',
    description: 'DNA 获取 ×1.25',
    cost: 60,
    requires: [],
    effects: { dnaMultiplier: 1.25 },
    skinPart: 'gene_mark1',
    order: 0,
  },
  {
    id: 'gene_2',
    branch: 'gene',
    name: '孵化 II',
    description: 'DNA 获取 ×1.5',
    cost: 140,
    requires: ['gene_1'],
    effects: { dnaMultiplier: 1.5 },
    skinPart: 'gene_mark2',
    order: 1,
  },
  {
    id: 'gene_3',
    branch: 'gene',
    name: '孵化 III',
    description: 'DNA 获取 ×2.0',
    cost: 260,
    requires: ['gene_2'],
    effects: { dnaMultiplier: 2.0 },
    skinPart: 'gene_mark3',
    order: 2,
  },
  {
    id: 'gene_4',
    branch: 'gene',
    name: '孵化 IV',
    description: 'DNA 获取 ×2.5',
    cost: 420,
    requires: ['gene_3'],
    effects: { dnaMultiplier: 2.5 },
    skinPart: 'gene_mark4',
    order: 3,
  },
  {
    id: 'gene_5',
    branch: 'gene',
    name: '孵化 V',
    description: 'DNA 获取 ×3.0',
    cost: 580,
    requires: ['gene_4'],
    effects: { dnaMultiplier: 3.0 },
    skinPart: 'gene_mark5',
    order: 4,
  },
  {
    id: 'gene_6',
    branch: 'gene',
    name: '破壳超螺旋',
    description: 'DNA 获取 ×3.5',
    cost: 760,
    requires: ['gene_5'],
    effects: { dnaMultiplier: 3.5 },
    skinPart: 'gene_mark6',
    order: 5,
  },

  // Apex finals — require all four branch tips (implies 4×6 filled); independent of each other
  {
    id: 'apex_start',
    branch: 'apex',
    name: '开馆疾冲',
    description: '开局超高速冲刺至 800 米，接近时减速，抵达后短暂无敌',
    cost: 4000,
    requires: [...APEX_CORE_REQUIRES],
    effects: { startWarpMeters: 800 },
    skinPart: 'apex_boost',
    order: 0,
  },
  {
    id: 'apex_revive',
    branch: 'apex',
    name: '蜕皮余温',
    description: '死后冲刺 400 米（同速感），冲刺结束后仍判定死亡',
    cost: 4000,
    requires: [...APEX_CORE_REQUIRES],
    effects: { deathWarpMeters: 400 },
    skinPart: 'apex_echo',
    order: 1,
  },
  {
    id: 'apex_bolt',
    branch: 'apex',
    name: '鳞光清道',
    description: '每 8 秒向前发射射弹，自动摧毁碰到的第一个障碍',
    cost: 4000,
    requires: [...APEX_CORE_REQUIRES],
    effects: { boltIntervalSec: 8 },
    skinPart: 'apex_bolt',
    order: 2,
  },
  {
    id: 'apex_flex',
    branch: 'apex',
    name: '摸鳞闪转',
    description: '点击蹲下可打断跳跃（含空中），跳跃可打断蹲下',
    cost: 4000,
    requires: [...APEX_CORE_REQUIRES],
    effects: { flexCancel: true },
    skinPart: 'apex_flex',
    order: 3,
  },
];

export function getNode(id: string): EvolutionNode | undefined {
  return EVOLUTION_NODES.find((n) => n.id === id);
}

export function canUnlock(nodeId: string, unlocked: string[], dna: number): boolean {
  const node = getNode(nodeId);
  if (!node) return false;
  if (unlocked.includes(nodeId)) return false;
  if (dna < node.cost) return false;
  return node.requires.every((r) => unlocked.includes(r));
}

export interface RuntimeBonuses {
  jumpWindupMul: number;
  duckWindupMul: number;
  jumpForceMul: number;
  doubleJump: boolean;
  airDrift: number;
  shieldCharges: number;
  iframeMs: number;
  hitboxShrink: number;
  landRecoveryMul: number;
  nightVision: boolean;
  obstaclePreview: boolean;
  startDashMs: number;
  dnaMultiplier: number;
  dnaBonus: number;
  startWarpMeters: number;
  deathWarpMeters: number;
  boltIntervalSec: number;
  flexCancel: boolean;
}

export function computeBonuses(unlocked: string[]): RuntimeBonuses {
  const bonuses: RuntimeBonuses = {
    jumpWindupMul: 1,
    duckWindupMul: 1,
    jumpForceMul: 1,
    doubleJump: false,
    airDrift: 0,
    shieldCharges: 0,
    iframeMs: 0,
    hitboxShrink: 0,
    landRecoveryMul: 1,
    nightVision: false,
    obstaclePreview: false,
    startDashMs: 0,
    dnaMultiplier: 1,
    dnaBonus: 0,
    startWarpMeters: 0,
    deathWarpMeters: 0,
    boltIntervalSec: 0,
    flexCancel: false,
  };

  for (const id of unlocked) {
    const node = getNode(id);
    if (!node) continue;
    const e = node.effects;
    if (e.jumpWindupMul != null) {
      bonuses.jumpWindupMul = Math.min(bonuses.jumpWindupMul, e.jumpWindupMul);
    }
    if (e.duckWindupMul != null) {
      bonuses.duckWindupMul = Math.min(bonuses.duckWindupMul, e.duckWindupMul);
    }
    if (e.jumpForceMul != null) {
      bonuses.jumpForceMul *= e.jumpForceMul;
    }
    if (e.doubleJump) bonuses.doubleJump = true;
    if (e.airDrift != null) bonuses.airDrift = Math.max(bonuses.airDrift, e.airDrift);
    if (e.shieldCharges != null) {
      bonuses.shieldCharges = Math.max(bonuses.shieldCharges, e.shieldCharges);
    }
    if (e.iframeMs != null) bonuses.iframeMs = Math.max(bonuses.iframeMs, e.iframeMs);
    if (e.hitboxShrink != null) {
      bonuses.hitboxShrink = Math.max(bonuses.hitboxShrink, e.hitboxShrink);
    }
    if (e.landRecoveryMul != null) {
      bonuses.landRecoveryMul = Math.min(bonuses.landRecoveryMul, e.landRecoveryMul);
    }
    if (e.nightVision) bonuses.nightVision = true;
    if (e.obstaclePreview) bonuses.obstaclePreview = true;
    if (e.startDashMs != null) {
      bonuses.startDashMs = Math.max(bonuses.startDashMs, e.startDashMs);
    }
    if (e.dnaMultiplier != null) {
      bonuses.dnaMultiplier = Math.max(bonuses.dnaMultiplier, e.dnaMultiplier);
    }
    if (e.dnaBonus != null) bonuses.dnaBonus += e.dnaBonus;
    if (e.startWarpMeters != null) {
      bonuses.startWarpMeters = Math.max(bonuses.startWarpMeters, e.startWarpMeters);
    }
    if (e.deathWarpMeters != null) {
      bonuses.deathWarpMeters = Math.max(bonuses.deathWarpMeters, e.deathWarpMeters);
    }
    if (e.boltIntervalSec != null) {
      bonuses.boltIntervalSec = Math.max(bonuses.boltIntervalSec, e.boltIntervalSec);
    }
    if (e.flexCancel) bonuses.flexCancel = true;
  }

  return bonuses;
}

export function totalDnaMultiplier(unlocked: string[]): number {
  const b = computeBonuses(unlocked);
  return b.dnaMultiplier * (1 + b.dnaBonus);
}
