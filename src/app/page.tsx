import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, AlertCircle, Plus } from "lucide-react";

export default function HomePage() {
  const stats = [
    {
      title: "Active Students",
      value: "1,234",
      description: "Across all classes",
      icon: Users,
    },
    {
      title: "Pending Payments",
      value: "45",
      description: "Students with dues",
      icon: AlertCircle,
    },
    {
      title: "Upcoming Exams",
      value: "Midterm",
      description: "Starts in 5 days",
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back to the Teacher Portal.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Link href="/students/new">
              <Button className="w-full justify-start space-x-2" size="lg" variant="outline">
                <Plus className="h-5 w-5" />
                <span>Register New Student</span>
              </Button>
            </Link>
            <Link href="/marks">
              <Button className="w-full justify-start space-x-2" size="lg" variant="outline">
                <BookOpen className="h-5 w-5" />
                <span>Enter Marks</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
