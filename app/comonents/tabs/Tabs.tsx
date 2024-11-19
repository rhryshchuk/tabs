"use client";
import { loadTabs, saveTabs, removeTab } from "@/app/utils/storage";
import { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import "./style.css";

interface Tab {
  id: number;        
  title: string;     
  pinned: boolean;   
}

const Tabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);           
  const [draggingTab, setDraggingTab] = useState<Tab | null>(null); 
  const [dragDelay, setDragDelay] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number | null>(null);
    
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
    saveTabs(tabs);
  }, [tabs]);

  // Обробник для початку перетягування
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tab: Tab) => {
    setDraggingTab(tab);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
  };

  // Обробник для перетягування
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>,targetTab: Tab) => {
    e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (
      (targetTab.pinned && draggingTab && !draggingTab.pinned) ||
      (!targetTab.pinned && draggingTab && draggingTab.pinned) 
    ) {
      e.preventDefault();
    }
  };

  // Обробник для скидання перетягування
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetTab: Tab) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggingTab?.id === targetTab.id) return;
      
    if (
      (targetTab.pinned && draggingTab && !draggingTab.pinned) || 
      (!targetTab.pinned && draggingTab && draggingTab.pinned) 
    ) {
      return;
    }

    const newTabs = tabs.filter((tab) => tab.id !== draggingTab?.id);
    const targetIndex = tabs.indexOf(targetTab);
    newTabs.splice(targetIndex, 0, draggingTab!);

    setTabs(newTabs);
    setDraggingTab(null);
  };

  const handleDragEnd = () => {
    setDraggingTab(null);
  };

  // Функція для зміни статусу закріплення таба
  const togglePin = (tab: Tab) => {
    const newTabs = tabs.map((t) =>
      t.id === tab.id ? { ...t, pinned: !t.pinned } : t
    );
    setTabs(newTabs);
  };

  // Функція для обробки кліку на таб
  const handleTabClick = (tab: Tab) => {
    if (activeTab === tab.id) return; 
    setActiveTab(tab.id);
    };
    
  const handleRemoveTab = (tabId: number) => {
    removeTab(tabId);
    setTabs(tabs.filter(tab => tab.id !== tabId));
  };


  return (
    <div className="tabs">
      <div className="pinned-tabs">
        {tabs.filter((tab) => tab.pinned).map((tab) => (
          <div
            key={tab.id}
            draggable={dragDelay}
            onDragStart={(e) => handleDragStart(e, tab)}
            onDragOver={(e) => handleDragOver(e, tab)}
            onDrop={(e) => handleDrop(e, tab)}
            onDragEnd={handleDragEnd}
            className={`tab ${tab.pinned ? "pinned" : ""} ${activeTab === tab.id ? "active" : ""}`}
            style={{
              opacity: tab === draggingTab ? 0.5 : 1,
              cursor: tab === draggingTab ? "grabbing" : "move",
            }}
            onClick={() => handleTabClick(tab)}
          >
            <span>{tab.title}</span>
            <button onClick={() => togglePin(tab)}>
              {tab.pinned ? "Unpin" : "Pin"}
            </button>
            <button className="remove-tab" onClick={() => handleRemoveTab(tab.id)}><TiDelete/></button>
          </div>
        ))}
      </div>

      <div className="scrollable-tabs">
        {tabs.filter((tab) => !tab.pinned).map((tab) => (
          <div
            key={tab.id}
            draggable={dragDelay}
            onDragStart={(e) => handleDragStart(e, tab)}
            onDragOver={(e) => handleDragOver(e, tab)}
            onDrop={(e) => handleDrop(e, tab)}
            onDragEnd={handleDragEnd}
            className={`tab ${tab.pinned ? "pinned" : ""} ${activeTab === tab.id ? "active" : ""}`}
            style={{
              opacity: tab === draggingTab ? 0.5 : 1,
              cursor: tab === draggingTab ? "grabbing" : "move",
            }}
            onClick={() => handleTabClick(tab)}
          >
            <span>{tab.title}</span>
            <button onClick={() => togglePin(tab)}>
              {tab.pinned ? "Unpin" : "Pin"}
            </button>
            <button className="remove-tab" onClick={() => handleRemoveTab(tab.id)}><TiDelete/></button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;