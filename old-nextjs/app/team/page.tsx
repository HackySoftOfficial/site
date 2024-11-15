import { TeamMemberCard } from '@/components/team-member-card';

const TEAM_MEMBERS = [
  {
    id: "andrexyt",
    name: "AndrexYT",
    role: "Full-stack Developer",
    github: "https://github.com/andrexyt",
  },
  {
    id: "catdrout",
    name: "Catdrout",
    role: "Python Developer",
    github: "https://github.com/suediedev",
  }
];

const MEMBER_IDS = TEAM_MEMBERS.map(member => member.id);

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Team</h1>
          <p className="text-xl text-muted-foreground">
            Meet the talented individuals behind HackySoft
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              teamMembers={MEMBER_IDS}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 