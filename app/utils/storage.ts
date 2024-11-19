export const loadTabs = () => {
    if (typeof window !== undefined) {
        const savedTabs = localStorage.getItem("tabs");

        return savedTabs ? JSON.parse(savedTabs) : []
    }
    return [];
}

export const saveTabs = (tabs) => {
    if (typeof window !== undefined) {
     localStorage.setItem("tabs", JSON.stringify(tabs))
 }
}