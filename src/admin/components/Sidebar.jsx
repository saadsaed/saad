import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Home, 
  User, 
  Briefcase, 
  FolderGit, 
  Cpu, 
  Wrench, 
  GitMerge, 
  Mail, 
  Image, 
  Globe, 
  Settings,
  X
} from "lucide-react";

export const MENU_ITEMS = [
  { group: "Overview", items: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard }
  ]},
  { group: "Content", items: [
    { label: "Homepage", path: "/admin/homepage", icon: Home },
    { label: "About", path: "/admin/about", icon: User },
    { label: "Services", path: "/admin/services", icon: Briefcase },
    { label: "Projects", path: "/admin/projects", icon: FolderGit },
    { label: "Automations", path: "/admin/automations", icon: Cpu },
    { label: "Technologies", path: "/admin/technologies", icon: Wrench },
    { label: "Process", path: "/admin/process", icon: GitMerge }
  ]},
  { group: "Communication", items: [
    { label: "Contact", path: "/admin/contact", icon: Mail }
  ]},
  { group: "Assets", items: [
    { label: "Media", path: "/admin/media", icon: Image }
  ]},
  { group: "Configuration", items: [
    { label: "SEO", path: "/admin/seo", icon: Globe },
    { label: "Settings", path: "/admin/settings", icon: Settings }
  ]}
];

export default function Sidebar({ isOpen, onClose }) {
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-neutral-200 p-6 flex flex-col gap-6 transition-transform duration-300 ease-in-out
    lg:static lg:translate-x-0
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-30 bg-neutral-900/20 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between lg:justify-start">
          <div className="font-bold text-lg text-neutral-900 tracking-tight">Saad Saeed</div>
          <button onClick={onClose} className="lg:hidden text-neutral-500 hover:text-neutral-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
          {MENU_ITEMS.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-3">
                {group.group}
              </span>
              <ul className="flex flex-col gap-1">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <li key={itemIdx}>
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
                          flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
                          ${isActive 
                            ? "bg-neutral-900 text-white" 
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"}
                        `}
                      >
                        <Icon size={18} />
                        {item.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
