import type { GradePyramidItem, AscentTypeDistribution } from '../types/user';
import type { RadarSkill } from '../types/user';

export function computePyramid(ascents: { grade: string }[]): GradePyramidItem[] {
  const map = new Map<string, number>();
  for (const a of ascents) map.set(a.grade, (map.get(a.grade) || 0) + 1);
  return [...map.entries()]
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => b.count - a.count || a.grade.localeCompare(b.grade));
}

export function computeDistribution(ascents: { style: string }[]): AscentTypeDistribution[] {
  const map = new Map<string, number>();
  for (const a of ascents) map.set(a.style, (map.get(a.style) || 0) + 1);
  return [...map.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

/** Преобразует восхождения в формат RadarSkillsResponse.categories.
 *  Теги — массив объектов { name, category }.
 */
export function computeCategories(ascents: { tags?: { name: string; category: string }[] }[]): Record<string, RadarSkill[]> {
  const result: Record<string, RadarSkill[]> = {};
  const catSet = new Set<string>();

  // Собираем все категории тегов
  for (const a of ascents) {
    if (a.tags) for (const t of a.tags) catSet.add(t.category);
  }

  for (const cat of catSet) {
    const map = new Map<string, number>();
    for (const a of ascents) {
      if (a.tags) {
        for (const t of a.tags) {
          if (t.category === cat) {
            map.set(t.name, (map.get(t.name) || 0) + 1);
          }
        }
      }
    }
    if (map.size >= 3) {
      result[cat] = [...map.entries()]
        .map(([name, count]) => ({ name, value: count }));
    }
  }

  return result;
}
