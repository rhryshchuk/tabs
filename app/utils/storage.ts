export interface Tab {
  id: number;
  title: string;
  pinned: boolean;
}

export const loadTabs = (): Tab[] => {
  if (typeof window !== "undefined") { 
    const savedTabs = localStorage.getItem("tabs");

    if (savedTabs) {
      try {
        return JSON.parse(savedTabs) as Tab[];
      } catch (error) {
        console.error("Error parsing saved tabs from localStorage:", error);
        return []; 
      }
    } else {
      return [
        { id: 1, title: "Tab 1", pinned: false },
        { id: 2, title: "Tab 2", pinned: true },
        { id: 3, title: "Tab 3", pinned: false },
        { id: 4, title: "Tab 4", pinned: false },
        { id: 5, title: "Tab 5", pinned: false },
        { id: 6, title: "Tab 6", pinned: false },
        { id: 7, title: "Tab 7", pinned: false },
        { id: 8, title: "Tab 8", pinned: false },
        { id: 9, title: "Tab 9", pinned: false },
      ];
    }
  }
  return []; 
}

export const saveTabs = (tabs: Tab[]): void => {
  if (typeof window !== "undefined") { 
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }
}
