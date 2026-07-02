import { create } from "zustand";

export const useToolStore = create((set, get) => ({
  tools: [],
  categories: ["AI","PDF","Image","Video","Audio","SEO","Developer","Writing","Finance","Security","Business","Education"],
  activeCategory: null,
  searchQuery: "",
  chainSteps: [],

  setTools: (tools) => set({ tools }),
  setCategory: (cat) => set({ activeCategory: cat }),
  setSearch: (q) => set({ searchQuery: q }),

  filteredTools: () => {
    const { tools, activeCategory, searchQuery } = get();
    return tools.filter((t) => {
      const matchCat = !activeCategory || t.category === activeCategory;
      const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  },

  addChainStep: (tool) => set((s) => ({ chainSteps: [...s.chainSteps, { ...tool, id: Date.now() }] })),
  removeChainStep: (id) => set((s) => ({ chainSteps: s.chainSteps.filter((t) => t.id !== id) })),
  clearChain: () => set({ chainSteps: [] }),
}));
