import { Outlet } from "@remix-run/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { FileText, BookOpen } from "lucide-react"

export default function ContentManagementLayout() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">
          Kelola artikel, blog, tips, dan panduan untuk aplikasi pengelolaan sampah
        </p>
      </div>
      
      <Tabs defaultValue="artikel-blog" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="artikel-blog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Artikel & Blog
          </TabsTrigger>
          <TabsTrigger value="tips-panduan" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Tips & Panduan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="artikel-blog" className="space-y-4">
          <Outlet />
        </TabsContent>
        
        <TabsContent value="tips-panduan" className="space-y-4">
          <Outlet />
        </TabsContent>
      </Tabs>
    </div>
  )
}