import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NavigationItem {
  id?: string;
  name: string;
  href?: string;
  backLink?: string;
  description?: string;
  logoUrl?: string | null;
  type?: "workspace" | "project" | "feature" | "issue" | "custom";
  iconType?: string;
}

interface NavigationState {
  stack: NavigationItem[];
  history: NavigationItem[][];
  historyIndex: number;

  push: (item: NavigationItem) => void;
  pop: () => void;
  setStack: (items: NavigationItem[]) => void;
  navigateToIndex: (index: number) => NavigationItem | undefined;
  goBack: () => NavigationItem | undefined;
  goForward: () => NavigationItem | undefined;
  clear: () => void;
}

const DEFAULT_ROOT_STACK: NavigationItem[] = [
  {
    id: "projects-root",
    name: "Projects",
    href: "/",
    backLink: "/",
  },
];

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      stack: DEFAULT_ROOT_STACK,
      history: [DEFAULT_ROOT_STACK],
      historyIndex: 0,

      push: (item) => {
        const currentStack = get().stack;
        const itemId = item.id || item.name;
        if (
          currentStack.length > 0 &&
          (currentStack[currentStack.length - 1].id === itemId ||
            currentStack[currentStack.length - 1].name === item.name)
        ) {
          return;
        }

        const newItem = { ...item, id: itemId };
        const newStack = [...currentStack, newItem];
        const newHistory = get().history.slice(0, get().historyIndex + 1);
        newHistory.push(newStack);

        set({
          stack: newStack,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      pop: () => {
        const currentStack = get().stack;
        if (currentStack.length <= 1) return;
        const newStack = currentStack.slice(0, -1);
        const newHistory = get().history.slice(0, get().historyIndex + 1);
        newHistory.push(newStack);

        set({
          stack: newStack,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      setStack: (items) => {
        if (!items || items.length === 0) return;
        const currentStack = get().stack;

        const isSame =
          currentStack.length === items.length &&
          currentStack.every(
            (it, idx) =>
              (it.id || it.name) === (items[idx].id || items[idx].name) &&
              it.name === items[idx].name,
          );

        if (isSame) return;

        const normalizedItems = items.map((it) => ({
          ...it,
          id: it.id || it.name,
        }));

        const newHistory = get().history.slice(0, get().historyIndex + 1);
        newHistory.push(normalizedItems);

        set({
          stack: normalizedItems,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      navigateToIndex: (index) => {
        const currentStack = get().stack;
        if (index < 0 || index >= currentStack.length) return undefined;
        const newStack = currentStack.slice(0, index + 1);
        const targetItem = newStack[newStack.length - 1];

        const newHistory = get().history.slice(0, get().historyIndex + 1);
        newHistory.push(newStack);

        set({
          stack: newStack,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });

        return targetItem;
      },

      goBack: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const prevIndex = historyIndex - 1;
          const prevStack = history[prevIndex];
          set({
            stack: prevStack,
            historyIndex: prevIndex,
          });
          return prevStack[prevStack.length - 1];
        }
        return undefined;
      },

      goForward: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const nextIndex = historyIndex + 1;
          const nextStack = history[nextIndex];
          set({
            stack: nextStack,
            historyIndex: nextIndex,
          });
          return nextStack[nextStack.length - 1];
        }
        return undefined;
      },

      clear: () => {
        set({
          stack: DEFAULT_ROOT_STACK,
          history: [DEFAULT_ROOT_STACK],
          historyIndex: 0,
        });
      },
    }),
    {
      name: "navigation-storage",
    },
  ),
);
