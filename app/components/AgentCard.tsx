import Link from "next/link";

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  propertiesCount: number;
  salesVolume: string;
  email: string;
  phone: string;
  status: "Active" | "Away" | string;
}

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="group card-hover bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 border border-outline-variant/30 p-6 flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full border-4 border-primary-fixed overflow-hidden">
          <img
            alt={agent.name}
            className="w-full h-full object-cover"
            src={agent.avatar}
          />
        </div>
        <span
          className={`absolute bottom-0 right-2 w-4 h-4 rounded-full border-2 border-surface ${
            agent.status === "Active" ? "bg-tertiary" : "bg-secondary"
          }`}
        ></span>
      </div>

      <h3 className="text-headline-md font-bold text-on-surface">{agent.name}</h3>
      <p className="text-body-sm text-on-surface-variant mb-4">{agent.role}</p>

      <div className="grid grid-cols-2 gap-4 w-full py-4 border-y border-outline-variant/30 mb-4">
        <div>
          <p className="text-body-sm text-on-surface-variant">Active Listings</p>
          <p className="text-headline-sm font-bold text-on-surface">{agent.propertiesCount}</p>
        </div>
        <div>
          <p className="text-body-sm text-on-surface-variant">Sales Volume</p>
          <p className="text-headline-sm font-bold text-primary">{agent.salesVolume}</p>
        </div>
      </div>

      <div className="space-y-2 w-full mb-4 text-left">
        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">mail</span>
          <span className="truncate">{agent.email}</span>
        </div>
        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">call</span>
          <span>{agent.phone}</span>
        </div>
      </div>

      <div className="flex gap-2 w-full mt-auto">
        <Link
          href={`/team/${agent.id}`}
          className="flex-1 bg-surface-container-high text-on-surface py-2 rounded-lg text-label-sm font-semibold hover:bg-primary hover:text-on-primary transition-all text-center"
        >
          View Profile
        </Link>
        <a
          href={`mailto:${agent.email}`}
          className="px-3 bg-surface-container-high text-on-surface py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </a>
      </div>
    </div>
  );
}
