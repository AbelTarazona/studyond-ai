import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Plus } from "lucide-react";

// --- Card with image hover ---
export function ImageCard() {
  return (
    <Card className="group overflow-hidden">
      <div className="aspect-[4/5] overflow-hidden">
        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium leading-snug line-clamp-2 transition-colors group-hover:text-primary">
          Title
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Description</p>
      </CardContent>
    </Card>
  );
}

// --- Badges ---
export function BadgeExamples() {
  return (
    <div className="flex gap-2">
      <Badge variant="default">Status</Badge>
      <Badge variant="secondary">Category</Badge>
      <Badge variant="outline">Tag</Badge>
    </div>
  );
}

// --- Icons ---
export function IconExamples() {
  return (
    <div className="flex items-center gap-2">
      <Search className="size-4" />       {/* 16px — standard */}
      <ArrowRight className="size-5" />   {/* 20px — prominent */}
      <Plus className="size-6" />         {/* 24px — large */}
    </div>
  );
}

// --- AI accent usage ---
export function AiAccentExamples() {
  return (
    <div className="space-y-4">
      {/* AI badge */}
      <span className="text-ai font-semibold">AI Suggestion</span>

      {/* AI button */}
      <Button className="bg-ai hover:opacity-90">Ask AI</Button>

      {/* AI card border */}
      <Card className="border-ai">
        <CardContent className="p-4">AI-enhanced content</CardContent>
      </Card>
    </div>
  );
}
