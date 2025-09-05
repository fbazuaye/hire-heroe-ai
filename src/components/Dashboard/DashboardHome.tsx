import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Briefcase, Users, BookOpen, Heart, TrendingUp, Plus } from 'lucide-react';

const DashboardHome = () => {
  const stats = [
    { title: 'Cover Letters', value: '3', icon: FileText, color: 'text-blue-600' },
    { title: 'Applications', value: '12', icon: Briefcase, color: 'text-green-600' },
    { title: 'Contacts', value: '8', icon: Users, color: 'text-purple-600' },
    { title: 'Skills Tracked', value: '15', icon: BookOpen, color: 'text-orange-600' },
  ];

  const quickActions = [
    { title: 'Create Cover Letter', description: 'Generate a personalized cover letter', icon: FileText, href: '/dashboard/cover-letters' },
    { title: 'Track Application', description: 'Add a new job application', icon: Briefcase, href: '/dashboard/applications' },
    { title: 'Add Contact', description: 'Expand your professional network', icon: Users, href: '/dashboard/networking' },
    { title: 'Daily Motivation', description: 'Get inspired for your job search', icon: Heart, href: '/dashboard/motivation' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your career assistant</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.description}</CardDescription>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Applied to Software Engineer at TechCorp</span>
              <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Created cover letter for Product Manager role</span>
              <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-muted-foreground">Added new contact: Sarah Chen (LinkedIn)</span>
              <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;