import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDisableInspect = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  // Verificar se usuário é admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setChecked(true);
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!data);
      setChecked(true);
    };

    checkAdmin();

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Se ainda não verificou ou é admin, não bloqueia
    if (!checked || isAdmin) return;

    // Desabilitar menu de contexto (clique direito)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    // Desabilitar atalhos de teclado para inspecionar
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j" || e.keyCode === 74)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c" || e.keyCode === 67)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === "u" || e.key === "U" || e.keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === "s" || e.key === "S" || e.keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Cmd+Option+I (Mac DevTools)
      if (e.metaKey && e.altKey && (e.key === "i" || e.key === "I" || e.keyCode === 73)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && (e.key === "j" || e.key === "J" || e.keyCode === 74)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Cmd+Option+C (Mac Inspect)
      if (e.metaKey && e.altKey && (e.key === "c" || e.key === "C" || e.keyCode === 67)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Cmd+Option+U (Mac View Source)
      if (e.metaKey && e.altKey && (e.key === "u" || e.key === "U" || e.keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Adicionar listeners com capture para pegar antes de extensões
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("keydown", handleKeyDown, true);

    // Sobrescrever console para dificultar debug
    const noop = () => {};
    const originalConsole = { ...console };
    
    Object.keys(console).forEach(key => {
      (console as any)[key] = noop;
    });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      // Restaurar console
      Object.assign(console, originalConsole);
    };
  }, [checked, isAdmin]);
};
