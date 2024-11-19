export const loadTabs = () => {
    if (typeof window !== undefined) {
        const savedTabs = localStorage.getItem("tabs");

        return savedTabs ? JSON.parse(savedTabs) :
            [
                { id: 1, title: "Tab 1", pinned: false },
                { id: 2, title: "Tab 2", pinned: true },
                { id: 3, title: "Tab 3", pinned: false },
            ]
    }
    return [];
}

export const saveTabs = (tabs) => {
    if (typeof window !== undefined) {
     localStorage.setItem("tabs", JSON.stringify(tabs))
 }
}