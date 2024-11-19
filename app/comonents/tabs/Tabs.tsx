"use client"
import { loadTabs, saveTabs } from "@/app/utils/storage";
import { useState, useEffect } from "react";

const Tabs = () => {
  const [tabs, setTabs] = useState([]);
  const [draggingTab, setDraggingTab] = useState(null);
  const [dragDelay, setDragDelay] = useState(false);

    useEffect(() => {
    const timer = setTimeout(() => {
      setDragDelay(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedTabs = loadTabs();
    if (savedTabs) {
      setTabs(savedTabs);
    }
  }, []);

    useEffect(() => {
    saveTabs(tabs)
  }, [tabs]);

  const handleDragStart = (e, tab) => {
     if (tab.pinned) {
      e.preventDefault();
      return;
    }
    setDraggingTab(tab);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = 0.5;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetTab) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggingTab.id === targetTab.id) return;

    const newTabs = tabs.filter((tab) => tab.id !== draggingTab.id);
    const targetIndex = tabs.indexOf(targetTab);
    newTabs.splice(targetIndex, 0, draggingTab);

    setTabs(newTabs);
    setDraggingTab(null);
  };

  const handleDragEnd = () => {
    setDraggingTab(null);
  };

  const togglePin = (tab) => {
    const newTabs = tabs.map((t) =>
      t.id === tab.id ? { ...t, pinned: !t.pinned } : t
    );
    setTabs(newTabs);
  };

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          draggable={dragDelay} // Перетаскивание разрешено после задержки на мобильных устройствах
          onDragStart={(e) => handleDragStart(e, tab)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, tab)}
          onDragEnd={handleDragEnd}
          className={`tab ${tab.pinned ? "pinned" : ""}`}
          style={{
            opacity: tab === draggingTab ? 0.5 : 1,
            cursor: tab === draggingTab ? "grabbing" : "move", // Меняем курсор при перетаскивании
          }}
        >
          <span>{tab.title}</span>
          <button onClick={() => togglePin(tab)}>
            {tab.pinned ? "Unpin" : "Pin"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
