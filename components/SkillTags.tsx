import { Badge } from "@/components/ui/badge";

interface SkillTagsProps {
  skills: string[];
}

export function SkillTags({ skills }: SkillTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <Badge
          key={index}
          variant="destructive"
          className="px-3 py-1 text-sm font-medium"
        >
          {skill}
        </Badge>
      ))}
    </div>
  );
}
