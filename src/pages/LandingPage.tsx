import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bell, BarChart3, MessageSquare, BookOpen, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: "Member Management & Discipleship Tracking",
      description: "Comprehensive member database with discipleship journey tracking and growth analytics."
    },
    {
      icon: Bell,
      title: "Smart Pastoral Alerts",
      description: "AI-powered alerts for pastoral care opportunities and member engagement insights."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Detailed church analytics, attendance trends, and ministry effectiveness reports."
    },
    {
      icon: MessageSquare,
      title: "Communications Hub",
      description: "Centralized communication tools for announcements, newsletters, and member outreach."
    },
    {
      icon: BookOpen,
      title: "Ministry Support",
      description: "AI-assisted ministry planning, sermon preparation, and biblical resource management."
    },
    {
      icon: Settings,
      title: "Church Administration",
      description: "Streamlined church operations, event management, and volunteer coordination."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-church-blue/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">ECHAD SI Agent</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-primary to-church-blue bg-clip-text text-transparent">
              Church Management
            </span>{" "}
            System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your church operations with intelligent member management, 
            automated pastoral care alerts, and comprehensive analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything Your Church Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for modern church leadership and ministry management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Church Management?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of churches already using ECHAD SI Agent to grow their ministry and care for their members.
            </p>
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-primary">ECHAD SI Agent</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Empowering churches with AI-driven management solutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;