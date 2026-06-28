import { create } from 'zustand';

interface TagView {
  path: string;
  title: string;
  affix?: boolean; // 固定标签，不可关闭
}

interface TagsState {
  visitedViews: TagView[];
  addView: (view: TagView) => void;
  delView: (path: string) => void;
  delOthersViews: (path: string) => void;
  delAllViews: () => void;
}

const useTagsStore = create<TagsState>((set, get) => ({
  visitedViews: [{ path: '/', title: '首页', affix: true }],

  addView: (view) => {
    const { visitedViews } = get();
    if (visitedViews.some((v) => v.path === view.path)) return;
    set({ visitedViews: [...visitedViews, view] });
  },

  delView: (path) => {
    const { visitedViews } = get();
    set({ visitedViews: visitedViews.filter((v) => v.path !== path) });
  },

  delOthersViews: (path) => {
    set({
      visitedViews: get().visitedViews.filter(
        (v) => v.affix || v.path === path,
      ),
    });
  },

  delAllViews: () => {
    set({ visitedViews: get().visitedViews.filter((v) => v.affix) });
  },
}));

export default useTagsStore;
