import React from "react";
import { TiDelete } from "react-icons/ti";
import "./style.css";
import { ITab } from "../tabs/Tabs";

interface TabProps {
  tab: { id: number; title: string; pinned: boolean };
  activeTab: number | null;
  draggingTab: { id: number } | null;
  onClick: () => void;
  onPinToggle: () => void;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, tab: ITab) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, tab: ITab) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, tab: ITab) => void;
  onDragEnd: () => void;
}

const Tab: React.FC<TabProps> = ({
  tab,
  activeTab,
  draggingTab,
  onClick,
  onPinToggle,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, tab)}
      onDragOver={(e) => onDragOver(e, tab)}
      onDrop={(e) => onDrop(e, tab)}
      onDragEnd={onDragEnd}
      className={`tab ${tab.pinned ? "pinned" : ""} ${activeTab === tab.id ? "active" : ""}`}
      style={{
        opacity: tab === draggingTab ? 0.5 : 1,
        cursor: tab === draggingTab ? "grabbing" : "move",
      }}
      onClick={onClick}
    >
      <span>{tab.title}</span>
      <button onClick={onPinToggle}>{tab.pinned ? "Unpin" : "Pin"}</button>
      {activeTab === tab.id && (
        <button className="remove-tab" onClick={onRemove}>
          <TiDelete />
        </button>
      )}
    </div>
  );
};

export default Tab;
