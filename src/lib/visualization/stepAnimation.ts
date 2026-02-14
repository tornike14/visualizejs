export interface StepAnimatedItem {
  key: string;
  signature: string;
}

export function getChangedItemKeys(
  currentItems: StepAnimatedItem[],
  previousItems: StepAnimatedItem[]
): Set<string> {
  const previousMap = new Map<string, string>();
  for (const item of previousItems) {
    previousMap.set(item.key, item.signature);
  }

  const changedKeys = new Set<string>();
  for (const item of currentItems) {
    if (previousMap.get(item.key) !== item.signature) {
      changedKeys.add(item.key);
    }
  }

  return changedKeys;
}
