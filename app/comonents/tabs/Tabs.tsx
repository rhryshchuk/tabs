"use client"
import { loadTabs } from '@/app/utils/storage';
import React, { useEffect, useState } from 'react'

const Tabs: React.FC = () => {
    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [draggingTab, setDraggingTab] = useState(null);
    const [dragDelay, setDragDelay] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDragDelay(true);
        }, 2000)
        
        return clearTimeout(timer)
    }, []);

    useEffect(() => {
        const savedTabs = loadTabs();
          setTabs(savedTabs)
    }, []);

    useEffect(() => {
        localStorage.setItem("tabs" ,JSON.stringify(tabs))
    },[tabs])

}

export default Tabs;