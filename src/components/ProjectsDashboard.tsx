import React from 'react';
import {
  FolderPlus,
  Lock,
  Download,
  Upload,
  LayoutGrid,
} from 'lucide-react';
import { MotionScene } from '../engine/motionEngine';

interface ProjectsDashboardProps {
  projects: MotionScene[];
  activeProjectId: string;
  onSelectProject: (scene: MotionScene) => void;
  onCreateNewProject: () => void;
  onDownloadBackup: () => void;
  onRestoreBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSignIn: () => void;
}

export const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateNewProject,
  onDownloadBackup,
  onRestoreBackup,
  onOpenSignIn,
}) => {
  return (
    <div className="flex-1 flex min-h-0 bg-[#141416] text-[#f5f5f7] select-none overflow-hidden">
      {/* Left Sidebar matching image_bdeba8c7.png */}
      <aside className="w-[232px] border-r border-[#232327] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-3">
          <div className="text-[13px] font-semibold text-[#f5f5f7] px-2">
            Projects
          </div>
          <div className="space-y-1">
            <button
              type="button"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#f5f5f7] bg-[#1e1e23] rounded-[10px] cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-[#a0a0ab]" />
              <span>All</span>
            </button>
            <button
              type="button"
              onClick={onOpenSignIn}
              className="w-full flex items-center justify-between px-3 py-2 text-[13px] text-[#8e8e98] hover:text-[#f5f5f7] rounded-[10px] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <FolderPlus className="w-4 h-4" />
                <span>+ New folder</span>
              </span>
              <Lock className="w-3.5 h-3.5 text-[#5e5e68]" />
            </button>
          </div>
        </div>

        {/* Bottom Multiscene Templates Promo Card + Sign In Button */}
        <div className="space-y-3">
          <div
            onClick={() => {
              const multiscene = projects.find((p) => p.templateGroup === 'multiscene') || projects[0];
              if (multiscene) onSelectProject(multiscene);
            }}
            className="relative rounded-[16px] overflow-hidden border border-[#2d3858] p-3.5 cursor-pointer group"
            style={{
              background:
                'linear-gradient(155deg, #1b3278 0%, #101b3d 55%, #1d3c96 100%)',
            }}
          >
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-medium text-white bg-white/20 backdrop-blur rounded-full mb-3">
              New Drop
            </span>

            <div className="h-24 rounded-[10px] bg-[#16171b] border border-white/10 flex items-center justify-center p-2 mb-3">
              <div className="w-24 h-16 rounded-[6px] bg-gradient-to-br from-[#2d3426] to-[#141710] border border-white/15 p-2 flex flex-col justify-between">
                <span className="text-[8px] text-[#d4d4dc] leading-tight">
                  3D Perspective &amp; Kinetic Stream
                </span>
                <div className="flex justify-between text-[8px] font-bold text-white font-mono">
                  <span>60FPS</span>
                  <span>120K+</span>
                </div>
              </div>
            </div>

            <div className="text-[15px] font-bold text-white tracking-tight group-hover:underline">
              Multiscene Templates
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSignIn}
            className="w-full py-2 px-4 text-[12px] font-medium text-[#e4e4eb] bg-[#1a1a1f] hover:bg-[#23232a] border border-[#2c2c34] rounded-full transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </aside>

      {/* Right Main Projects Canvas */}
      <div className="flex-1 overflow-y-auto p-10 max-w-5xl">
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-2xl font-bold text-[#f5f5f7] tracking-tight">
              All projects
            </h1>
            <p className="text-[13px] text-[#8e8e98] mt-1 font-mono tabular-nums">
              1 of {projects.length} projects active
            </p>
          </div>

          <button
            type="button"
            onClick={onCreateNewProject}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-[#3b66f5] hover:bg-[#4e76ff] rounded-full transition-colors cursor-pointer shadow-[0_0_20px_rgba(59,102,245,0.3)]"
          >
            New project
          </button>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {projects.slice(0, 6).map((proj) => {
            const isCurrent = proj.id === activeProjectId;
            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className={`group p-3 rounded-[16px] bg-[#1b1b1f] border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#3b66f5] ring-1 ring-[#3b66f5]/40'
                    : 'border-[#25252c] hover:border-[#3a3a44]'
                }`}
              >
                <div className="aspect-square rounded-[12px] bg-[#0e0e11] border border-[#222228] flex items-center justify-center overflow-hidden mb-3">
                  {/* 3D Ring Artwork Preview */}
                  <svg viewBox="0 0 160 160" className="w-36 h-36 group-hover:scale-105 transition-transform">
                    <g transform="translate(80,80) rotate(-25)">
                      <ellipse cx="0" cy="0" rx="54" ry="28" fill="none" stroke="#2c2e36" strokeWidth="2" />
                      <rect x="-56" y="-12" width="22" height="22" rx="4" fill="#4f5643" transform="rotate(-18 -45 0)" />
                      <rect x="-32" y="-29" width="22" height="22" rx="4" fill="#3a4034" transform="rotate(-8 -21 -18)" />
                      <rect x="4" y="-30" width="22" height="22" rx="4" fill="#525a48" transform="rotate(8 15 -19)" />
                      <rect x="34" y="-14" width="24" height="24" rx="4" fill="#6b7458" transform="rotate(20 46 -2)" />
                      <rect x="16" y="14" width="28" height="26" rx="5" fill="#9aa88e" transform="rotate(8 30 27)" />
                      <rect x="-18" y="16" width="28" height="26" rx="5" fill="#7c8b70" transform="rotate(-6 -4 29)" />
                      <rect x="-46" y="8" width="25" height="24" rx="4.5" fill="#636d53" transform="rotate(-16 -34 20)" />
                    </g>
                  </svg>
                </div>

                <div className="px-1">
                  <div className="text-[14px] font-semibold text-[#f5f5f7] truncate">
                    {proj.name}
                  </div>
                  <div className="text-[12px] text-[#8e8e98] mt-0.5">
                    {proj.formation || 'Showcase Stream'} · Just now
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Backup & Persistence Note */}
        <div className="max-w-xl space-y-4">
          <p className="text-[12px] text-[#7c7c86] leading-relaxed">
            Projects are saved in this browser on this device — they aren&apos;t uploaded
            anywhere. Download a JSON backup anytime to share or restore your 3D motion
            scenes across workstations.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onDownloadBackup}
              className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-[#d4d4dc] bg-[#1a1a1f] hover:bg-[#232329] border border-[#2c2c34] rounded-full transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8e8e98]" />
              <span>Download backup</span>
            </button>

            <label className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-[#d4d4dc] bg-[#1a1a1f] hover:bg-[#232329] border border-[#2c2c34] rounded-full transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#8e8e98]" />
              <span>Restore from backup</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={onRestoreBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
