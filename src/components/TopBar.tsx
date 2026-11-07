import React, { useState } from 'react';
import { Folder, Undo2, Redo2, Sun } from 'lucide-react';

interface TopBarProps {
  projectName: string;
  onRenameProject: (nextName: string) => void;
  activeView: 'editor' | 'projects';
  onToggleProjectsView: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onToggleGridOverlay: () => void;
  onOpenExport: () => void;
  onOpenSignIn: () => void;
  userEmail: string | null;
}

export const TopBar: React.FC<TopBarProps> = ({
  projectName,
  onRenameProject,
  activeView,
  onToggleProjectsView,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onToggleGridOverlay,
  onOpenExport,
  onOpenSignIn,
  userEmail,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(projectName);

  return (
    <header className="h-[52px] px-4 bg-[#141416] border-b border-[#232327] flex items-center justify-between gap-6 shrink-0 select-none">
      {/* Left Zone: Brand Lockup + Projects Switcher + Undo/Redo */}
      <div className="flex items-center gap-3.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            if (activeView === 'projects') onToggleProjectsView();
          }}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          {/* 4-Petal Geometric Clover Mark */}
          <svg
            viewBox="0 0 28 28"
            className="w-6 h-6 shrink-0"
            aria-hidden="true"
          >
            <circle cx="9.5" cy="9.5" r="5" fill="#70b5f9" />
            <circle cx="18.5" cy="9.5" r="5" fill="#3b66f5" />
            <circle cx="9.5" cy="18.5" r="5" fill="#3b66f5" />
            <circle cx="18.5" cy="18.5" r="5" fill="#7c87f8" />
          </svg>
          <span className="text-[17px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            kinetix
          </span>
          <span className="px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase text-[#7c7c86] bg-[#1e1e22] rounded-full border border-[#2a2a30]">
            BETA
          </span>
        </button>

        <div className="h-4 w-[1px] bg-[#26262b]" />

        <button
          type="button"
          onClick={onToggleProjectsView}
          className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors cursor-pointer ${
            activeView === 'projects'
              ? 'bg-[#222227] text-[#f5f5f7]'
              : 'text-[#8e8e98] hover:text-[#f5f5f7] hover:bg-[#1c1c20]'
          }`}
        >
          <Folder className="w-4 h-4 text-[#8e8e98]" />
          <span>Projects</span>
        </button>

        {activeView === 'editor' && (
          <>
            <div className="h-4 w-[1px] bg-[#26262b]" />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Undo change"
                className={`p-1.5 rounded-[6px] transition-colors ${
                  canUndo
                    ? 'text-[#a0a0ab] hover:text-[#f5f5f7] hover:bg-[#1e1e24] cursor-pointer'
                    : 'text-[#45454d] cursor-not-allowed'
                }`}
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Redo change"
                className={`p-1.5 rounded-[6px] transition-colors ${
                  canRedo
                    ? 'text-[#a0a0ab] hover:text-[#f5f5f7] hover:bg-[#1e1e24] cursor-pointer'
                    : 'text-[#45454d] cursor-not-allowed'
                }`}
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Center Zone: Editable Project Title */}
      <div className="flex-1 flex items-center justify-center min-w-0">
        {activeView === 'editor' ? (
          editingTitle ? (
            <input
              type="text"
              value={draftTitle}
              aria-label="Project title"
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={() => {
                if (draftTitle.trim()) onRenameProject(draftTitle.trim());
                setEditingTitle(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (draftTitle.trim()) onRenameProject(draftTitle.trim());
                  setEditingTitle(false);
                }
              }}
              className="bg-[#1e1e22] border border-[#3b66f5] rounded-[6px] px-3 py-1 text-[13px] font-medium text-[#f5f5f7] text-center focus:outline-none"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraftTitle(projectName);
                setEditingTitle(true);
              }}
              title="Click to rename project"
              className="px-3 py-1 text-[13px] font-medium text-[#d4d4dc] hover:text-white rounded-[6px] hover:bg-[#1c1c20] transition-colors truncate cursor-pointer"
            >
              {projectName}
            </button>
          )
        ) : (
          <span className="text-[13px] font-medium text-[#8e8e98]">
            Workspace Projects
          </span>
        )}
      </div>

      {/* Right Zone: Canvas Grid Toggle, Blue Pill Export, Sign In */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onToggleGridOverlay}
          aria-label="Toggle stage grid backdrop"
          title="Toggle stage grid"
          className="p-2 text-[#8e8e98] hover:text-[#f5f5f7] hover:bg-[#1e1e22] rounded-full transition-colors cursor-pointer"
        >
          <Sun className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenExport}
          className="px-4 py-1.5 text-[13px] font-semibold text-white bg-[#3b66f5] hover:bg-[#4e76ff] active:bg-[#2f56dc] rounded-full transition-colors cursor-pointer whitespace-nowrap shadow-[0_0_20px_rgba(59,102,245,0.28)]"
        >
          Export
        </button>

        <button
          type="button"
          onClick={onOpenSignIn}
          className="px-4 py-1.5 text-[13px] font-medium text-[#e4e4eb] bg-[#1a1a1e] hover:bg-[#232329] border border-[#2c2c34] rounded-full transition-colors cursor-pointer whitespace-nowrap"
        >
          {userEmail ? userEmail.split('@')[0] : 'Sign in'}
        </button>
      </div>
    </header>
  );
};
