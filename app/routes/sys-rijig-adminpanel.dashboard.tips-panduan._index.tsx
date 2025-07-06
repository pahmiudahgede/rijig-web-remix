import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { BookOpen, Plus, Users, ThumbsUp } from "lucide-react";

// Mock data untuk tips & panduan
const mockTips = [
  {
    id: "1",
    title: "Panduan Lengkap Kompos Rumahan",
    category: "Panduan",
    difficulty: "Pemula",
    likes: 89,
    saves: 45,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "5 Tips Mengurangi Sampah Plastik",
    category: "Tips",
    difficulty: "Mudah",
    likes: 156,
    saves: 78,
    createdAt: "2024-01-14"
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ tips: mockTips });
}

export default function TipsPanduanIndex() {
  const { tips } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tips & Panduan</h2>
          <p className="text-muted-foreground">
            Kelola tips dan panduan untuk edukasi pengelolaan sampah
          </p>
        </div>
        <Button asChild>
          <Link to="create">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Tips
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tips</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tips.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tips.reduce((sum, t) => sum + t.likes, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saves</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tips.reduce((sum, t) => sum + t.saves, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Engagement
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                tips.reduce((sum, t) => sum + t.likes + t.saves, 0) /
                  tips.length
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => (
          <Card key={tip.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{tip.category}</Badge>
                <Badge
                  variant={tip.difficulty === "Mudah" ? "default" : "outline"}
                >
                  {tip.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{tip.createdAt}</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {tip.likes}
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {tip.saves}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`edit/${tip.id}`}>Edit</Link>
                </Button>
                <Button size="sm" variant="outline">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
