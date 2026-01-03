import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const { toast } = useToast();
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: "hover:bg-blue-700 hover:text-white",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=Check out this: ${encodedUrl}`,
      color: "hover:bg-red-500 hover:text-white",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-muted-foreground">Share</h4>
      <div className="flex gap-2 flex-wrap">
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            size="icon"
            className={`transition-colors ${link.color}`}
            onClick={() => window.open(link.url, "_blank", "width=600,height=400")}
            title={`Share on ${link.name}`}
          >
            <link.icon className="w-4 h-4" />
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={handleCopyLink}
          title="Copy link"
        >
          <Link2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
