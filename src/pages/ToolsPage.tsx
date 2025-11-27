import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  BarChart3,
  Megaphone,
  Mail,
  FileText,
  Image,
  Globe,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Users,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const toolsData = [
  {
    id: 1,
    name: "Keyword Analyzer",
    description: "Analyze keyword performance and find new opportunities.",
    icon: BarChart3,
    category: "SEO",
    usageCount: 45,
  },
  {
    id: 2,
    name: "Ad Campaign Builder",
    description: "Create and manage advertising campaigns across platforms.",
    icon: Megaphone,
    category: "Advertising",
    usageCount: 32,
  },
  {
    id: 3,
    name: "Email Automation",
    description: "Set up automated email sequences and workflows.",
    icon: Mail,
    category: "Email",
    usageCount: 67,
  },
  {
    id: 4,
    name: "Content Generator",
    description: "Generate engaging content for your marketing campaigns.",
    icon: FileText,
    category: "Content",
    usageCount: 28,
  },
  {
    id: 5,
    name: "Social Media Scheduler",
    description: "Schedule and publish posts across all social platforms.",
    icon: Calendar,
    category: "Social Media",
    usageCount: 54,
  },
  {
    id: 6,
    name: "Image Editor",
    description: "Edit and optimize images for your campaigns.",
    icon: Image,
    category: "Design",
    usageCount: 41,
  },
  {
    id: 7,
    name: "Website Analyzer",
    description: "Analyze website performance and get optimization tips.",
    icon: Globe,
    category: "Analytics",
    usageCount: 23,
  },
  {
    id: 8,
    name: "Competitor Research",
    description: "Track and analyze competitor marketing strategies.",
    icon: Target,
    category: "Research",
    usageCount: 19,
  },
  {
    id: 9,
    name: "SEO Optimizer",
    description: "Optimize your content for better search rankings.",
    icon: TrendingUp,
    category: "SEO",
    usageCount: 56,
  },
  {
    id: 10,
    name: "Automation Builder",
    description: "Build custom marketing automation workflows.",
    icon: Zap,
    category: "Automation",
    usageCount: 38,
  },
  {
    id: 11,
    name: "Audience Segmentation",
    description: "Segment your audience for targeted campaigns.",
    icon: Users,
    category: "Analytics",
    usageCount: 31,
  },
  {
    id: 12,
    name: "Landing Page Builder",
    description: "Create high-converting landing pages without coding.",
    icon: Globe,
    category: "Design",
    usageCount: 44,
  },
];

const ToolsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const categories = Array.from(new Set(toolsData.map((tool) => tool.category)));

  const filteredTools = toolsData.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalUsage = toolsData.reduce((sum, tool) => sum + tool.usageCount, 0);

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Marketing Tools</h1>
          <p className="text-base text-muted-foreground">
            Access powerful tools to enhance your marketing efforts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{toolsData.length}</p>
                <p className="text-sm text-muted-foreground">Total Tools</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{totalUsage}</p>
                <p className="text-sm text-muted-foreground">Total Uses</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Active Today</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Tools
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <tool.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{tool.category}</Badge>
                </div>
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {tool.usageCount}
                    </span>{" "}
                    uses
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() =>
                    toast({
                      title: "Tool Launched",
                      description: `Opening ${tool.name}...`,
                    })
                  }
                >
                  Launch Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No tools found matching your criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ToolsPage;
