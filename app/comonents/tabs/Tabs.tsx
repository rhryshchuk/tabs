"use client"
import { loadTabs, saveTabs, removeTab } from "@/app/utils/storage";
import { useState, useEffect } from "react";
import Tab from "../tab/Tab";
import "./style.css";

export interface ITab {
  id: number;
  title: string;
  pinned: boolean;
}

const Tabs = () => {
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [draggingTab, setDraggingTab] = useState<ITab | null>(null);
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tab: ITab) => {
    setDraggingTab(tab);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetTab: ITab) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (
      (targetTab.pinned && draggingTab && !draggingTab.pinned) ||
      (!targetTab.pinned && draggingTab && draggingTab.pinned)
    ) {
      e.preventDefault();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetTab: ITab) => {
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

  const togglePin = (tab: ITab) => {
    const newTabs = tabs.map((t) =>
      t.id === tab.id ? { ...t, pinned: !t.pinned } : t
    );
    setTabs(newTabs);
  };

  const handleTabClick = (tab: ITab) => {
    if (activeTab === tab.id) return;
    setActiveTab(tab.id);
  };

  const handleRemoveTab = (tabId: number) => {
    removeTab(tabId);
    setTabs(tabs.filter((tab) => tab.id !== tabId));
  };

  return (
    <div className="tabs">
      <div className="pinned-tabs">
        {tabs.filter((tab) => tab.pinned).map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            activeTab={activeTab}
            draggingTab={draggingTab}
            onClick={() => handleTabClick(tab)}
            onPinToggle={() => togglePin(tab)}
            onRemove={() => handleRemoveTab(tab.id)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      <div className="scrollable-tabs">
        {tabs.filter((tab) => !tab.pinned).map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            activeTab={activeTab}
            draggingTab={draggingTab}
            onClick={() => handleTabClick(tab)}
            onPinToggle={() => togglePin(tab)}
            onRemove={() => handleRemoveTab(tab.id)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default Tabs;
