import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

const LOCAL_KEY = 'cvAnalyzeList';

export type CvAnalyzeEntry = { cvId: string; analyzeId: string };

function getCvAnalyzeList(): CvAnalyzeEntry[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CvAnalyzeEntry[];
  } catch {
    return [];
  }
}

function setCvAnalyzeList(list: CvAnalyzeEntry[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  }
}

function getAnalyzeIdForCv(cvId: string): string | undefined {
  return getCvAnalyzeList().find(entry => entry.cvId === cvId)?.analyzeId;
}

function setAnalyzeIdForCv(cvId: string, analyzeId: string) {
  const list = getCvAnalyzeList();
  const idx = list.findIndex(entry => entry.cvId === cvId);
  if (idx !== -1) {
    list[idx].analyzeId = analyzeId;
  } else {
    list.push({ cvId, analyzeId });
  }
  setCvAnalyzeList(list);
}

function removeAnalyzeIdForCv(cvId: string) {
  const list = getCvAnalyzeList().filter(entry => entry.cvId !== cvId);
  setCvAnalyzeList(list);
}

// Atom for the list
const cvAnalyzeListAtom = atom<CvAnalyzeEntry[]>(getCvAnalyzeList());

// Sync atom with localStorage on set
const setCvAnalyzeListAtom = atom(
  get => get(cvAnalyzeListAtom),
  (get, set, list: CvAnalyzeEntry[]) => {
    setCvAnalyzeList(list);
    set(cvAnalyzeListAtom, list);
  }
);

// Hooks
export const useCvAnalyzeList = () => useAtom(setCvAnalyzeListAtom);
export const useCvAnalyzeListValue = () => useAtomValue(cvAnalyzeListAtom);
export const useSetCvAnalyzeList = () => useSetAtom(setCvAnalyzeListAtom);

// Per-cvId helpers for React
export function useAnalyzeIdForCv(
  cvId: string
): [string | undefined, (analyzeId: string | undefined) => void] {
  const [list, setList] = useCvAnalyzeList();
  const analyzeId = list.find(entry => entry.cvId === cvId)?.analyzeId;
  const setAnalyzeId = (analyzeId: string | undefined) => {
    let newList: CvAnalyzeEntry[];
    if (analyzeId) {
      const idx = list.findIndex(entry => entry.cvId === cvId);
      if (idx !== -1) {
        newList = [...list];
        newList[idx] = { cvId, analyzeId };
      } else {
        newList = [...list, { cvId, analyzeId }];
      }
    } else {
      newList = list.filter(entry => entry.cvId !== cvId);
    }
    setList(newList);
  };
  return [analyzeId, setAnalyzeId];
}

// Non-hook utilities for use outside React
export {
  getCvAnalyzeList,
  setCvAnalyzeList,
  getAnalyzeIdForCv,
  setAnalyzeIdForCv,
  removeAnalyzeIdForCv,
};
