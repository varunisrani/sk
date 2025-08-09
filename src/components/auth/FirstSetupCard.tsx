import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, UserPlus, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DEFAULT_CHURCH_ID = "00000000-0000-0000-0000-000000000000";

const FirstSetupCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingRole, setLoadingRole] = useState<"admin" | "pastor" | null>(null);

  if (!user) return null;

  const handleBootstrap = async (role: "admin" | "pastor") => {
    try {
      setLoadingRole(role);
      const fn = role === "admin" ? "bootstrap_first_admin" : "bootstrap_first_pastor";
      const { data, error } = await supabase.rpc(fn as any, { p_church_id: DEFAULT_CHURCH_ID });

      if (error) {
        toast({
          title: `Failed to become ${role}`,
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data === true) {
        toast({
          title: `You're now the first ${role}!`,
          description: "You have been granted the role successfully.",
        });
      } else {
        toast({
          title: `A ${role} already exists`,
          description: `This action is only available when there is no ${role} yet.`,
        });
      }
    } catch (e: any) {
      toast({
        title: "Unexpected error",
        description: e.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" /> First-time setup
        </CardTitle>
        <CardDescription>
          If this is a new church space, promote yourself to Admin or Pastor. This only works when no one has that role yet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={() => handleBootstrap("admin")}
            disabled={loadingRole !== null}
            className="flex-1"
          >
            {loadingRole === "admin" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Becoming first admin...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Become first admin
              </>
            )}
          </Button>
          <Button
            onClick={() => handleBootstrap("pastor")}
            variant="secondary"
            disabled={loadingRole !== null}
            className="flex-1"
          >
            {loadingRole === "pastor" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Becoming first pastor...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Become first pastor
              </>
            )}
          </Button>
          <Link to="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue to dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirstSetupCard;
