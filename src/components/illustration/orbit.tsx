import { AvatarOrbit, OrbitAvatar, type AvatarOrbitProps } from "./item";
import type { NavSubItem } from "@/utils/interface";
import {
  Activity,
  Bell,
  BookOpen,
  Calendar,
  ChartNoAxesCombined,
  CircleHelp,
  Cloud,
  Code,
  Compass,
  Database,
  FileText,
  Folder,
  House,
  Mail,
  Radio,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";

export interface OrbitData {
  brand: NavSubItem;
  navMain: NavSubItem[];
  navSecondary: NavSubItem[];
  navSignal: NavSubItem[];
}

export const demoData: OrbitData = {
  brand: { title: "Orbit", url: "", icon: Zap, description: "#4758a1" },
  navMain: [
    { title: "Home", url: "", icon: House, description: "#4758a1" },
    { title: "Explore", url: "", icon: Compass, description: "#0f766e" },
    { title: "Team", url: "", icon: Users, description: "#7c3aed" },
  ],
  navSecondary: [
    { title: "Projects", url: "", icon: Folder, description: "#b45309" },
    { title: "Calendar", url: "", icon: Calendar, description: "#0369a1" },
    { title: "Messages", url: "", icon: Mail, description: "#be185d" },
    { title: "Documents", url: "", icon: FileText, description: "#4758a1" },
    {
      title: "Analytics",
      url: "",
      icon: ChartNoAxesCombined,
      description: "#0f766e",
    },
    { title: "Settings", url: "", icon: Settings, description: "#52525b" },
  ],
  navSignal: [
    { title: "Activity", url: "", icon: Activity, description: "#15803d" },
    { title: "Notifications", url: "", icon: Bell, description: "#b45309" },
    { title: "Cloud", url: "", icon: Cloud, description: "#0369a1" },
    { title: "Code", url: "", icon: Code, description: "#7c3aed" },
    { title: "Database", url: "", icon: Database, description: "#4758a1" },
    { title: "Security", url: "", icon: Shield, description: "#0f766e" },
    { title: "Signals", url: "", icon: Radio, description: "#be185d" },
    { title: "Guides", url: "", icon: BookOpen, description: "#9f1239" },
    { title: "Help", url: "", icon: CircleHelp, description: "#52525b" },
  ],
};

export interface OrbitProps extends AvatarOrbitProps {
  data?: OrbitData;
}

export const OrbitDemo = ({ data = demoData, ...props }: OrbitProps) => {
  return (
    <div className="relative size-78 sm:size-104">
      <AvatarOrbit
        trigger="orbit"
        background={["ripple", "particles"]}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 sm:scale-100"
        orbitData={[
          {
            dashed: true,
            ringSize: 160,
            avatars: data.navMain.slice(0, 3),
            avatarSize: 36,
            duration: 16,
          },
          {
            dashed: true,
            ringSize: 280,
            avatars: data.navSecondary.slice(0, 6),
            avatarSize: 36,
            duration: 24,
            reverse: true,
          },
          {
            dashed: true,
            ringSize: 400,
            avatars: data.navSignal.slice(0, 9),
            avatarSize: 36,
            duration: 32,
          },
        ]}
        {...props}
      >
        <div className="relative z-10 rounded-full shadow-lg">
          <OrbitAvatar item={data.brand} size={54} />
        </div>
      </AvatarOrbit>
    </div>
  );
};

export function Orbit(props: OrbitProps) {
  return <OrbitDemo {...props} />;
}
