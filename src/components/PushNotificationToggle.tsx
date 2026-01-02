import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToast } from "@/hooks/use-toast";

const PushNotificationToggle = () => {
  const { toast } = useToast();
  const { 
    isSupported, 
    isSubscribed, 
    permission, 
    loading, 
    subscribe, 
    unsubscribe 
  } = usePushNotifications();

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      const success = await unsubscribe();
      if (success) {
        toast({
          title: "Notificações desativadas",
          description: "Você não receberá mais alertas push.",
        });
      }
    } else {
      const success = await subscribe();
      if (success) {
        toast({
          title: "Notificações ativadas! 🔔",
          description: "Você receberá alertas de ofertas exclusivas.",
        });
      } else if (permission === 'denied') {
        toast({
          title: "Permissão negada",
          description: "Habilite as notificações nas configurações do navegador.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      size="sm"
      variant={isSubscribed ? "default" : "outline"}
      onClick={handleToggle}
      disabled={loading}
      className={`h-9 w-9 p-0 ${isSubscribed ? 'bg-primary hover:bg-primary/90' : ''}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSubscribed ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
    </Button>
  );
};

export default PushNotificationToggle;
