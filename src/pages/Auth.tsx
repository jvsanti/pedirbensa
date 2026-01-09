import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Crown, Lock } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/admin');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Bem-vindo, Ser Superior!');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });
        if (error) throw error;
        toast.success('Conta criada! Faça login.');
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="card-decree rounded-2xl p-8 md:p-12 max-w-md w-full">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Crown className="w-8 h-8 text-primary" />
          <h1 className="font-display text-2xl md:text-3xl">
            Painel <span className="text-gradient">Supremo</span>
          </h1>
          <Crown className="w-8 h-8 text-primary" />
        </div>

        <div className="flex items-center gap-2 justify-center text-muted-foreground mb-6">
          <Lock className="w-4 h-4" />
          <span className="font-body italic">Área restrita aos Seres Superiores</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-display text-sm uppercase tracking-wider mb-2 text-foreground/80">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label className="block font-display text-sm uppercase tracking-wider mb-2 text-foreground/80">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-decree py-4 rounded-lg font-display text-lg text-primary-foreground uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-center text-muted-foreground font-body hover:text-primary transition-colors"
        >
          {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
        </button>

        <a
          href="/"
          className="block mt-6 text-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← Voltar ao site
        </a>
      </div>
    </div>
  );
};

export default Auth;
