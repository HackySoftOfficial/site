"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  github?: string;
  twitter?: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  teamMembers: string[];
}

export function TeamMemberCard({ member, teamMembers }: TeamMemberCardProps) {
  const router = useRouter();

  const handleRandomTeamMember = () => {
    const availableMembers = teamMembers.filter(id => id !== member.id);
    const randomMember = availableMembers[Math.floor(Math.random() * availableMembers.length)];
    router.push(`/team/${randomMember}`);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link href={`/team/${member.id}`}>
            <h3 className="text-2xl font-bold hover:text-primary transition-colors">
              {member.name}
            </h3>
          </Link>
          <p className="text-muted-foreground">{member.role}</p>
        </div>
        <div className="flex gap-2">
          {member.twitter && (
            <Button asChild>
              <Link href={member.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {member.github && (
            <Button asChild>
              <Link href={member.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <Button 
        className="w-full"
        onClick={handleRandomTeamMember}
      >
        View Another Team Member
      </Button>
    </Card>
  );
}